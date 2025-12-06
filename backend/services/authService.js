import User from "../models/user.js";
import Expert from "../models/expert.js";
import bcrypt from "bcryptjs";
import {
  createAccessToken,
  createRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../utils/token.js";

// Cookie configuration
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

const ACCESS_TOKEN_MAX_AGE = 1000 * 60 * 15; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days

/**
 * Creates tokens and sets cookies for a user
 */
export const setAuthCookies = async (res, user) => {
  const accessToken = createAccessToken({ id: user._id, role: user.role });
  const refreshToken = createRefreshToken({ id: user._id, role: user.role });

  // Store hashed refresh token in database
  const hashedToken = await hashToken(refreshToken);
  
  // Limit stored refresh tokens to 5 per user
  if (user.refreshTokens.length >= 5) {
    user.refreshTokens = user.refreshTokens.slice(-4);
  }
  
  user.refreshTokens.push({
    token: hashedToken,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
  });
  
  await user.save();

  // Set HTTP-only cookies
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
};

/**
 * Check if username is available
 */
export const checkUsernameAvailability = async (username) => {
  const normalizedUsername = username.toLowerCase().trim();
  const existingUser = await User.findOne({ username: normalizedUsername });
  return !existingUser;
};

/**
 * Register a new user (basic registration)
 */
export const registerUser = async (username, password, role = "user") => {
  const normalizedUsername = username.toLowerCase().trim();
  
  const existingUser = await User.findOne({ username: normalizedUsername });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser = new User({
    username: normalizedUsername,
    password,
    role,
  });
  
  await newUser.save();
  return newUser;
};

/**
 * Register expert (user + expert profile in one transaction)
 */
export const registerExpert = async (userData, expertData) => {
  const normalizedUsername = userData.username.toLowerCase().trim();
  
  const existingUser = await User.findOne({ username: normalizedUsername });
  if (existingUser) {
    throw new Error("Username already taken");
  }

  // Create user
  const newUser = new User({
    username: normalizedUsername,
    password: userData.password,
    role: "expert",
  });
  
  await newUser.save();

  try {
    // Create expert profile
    const expertProfile = new Expert({
      _id: newUser._id, // Link to user
      img: expertData.img,
      name: expertData.name.trim(),
      industry: expertData.industry?.trim(),
      location: expertData.location?.trim(),
      experienceYears: expertData.experienceYears,
      description: expertData.description?.trim(),
      rating: expertData.rating || 0,
      pricing: expertData.pricing,
    });

    await expertProfile.save();
    return newUser;
  } catch (error) {
    // Cleanup: Delete user if expert creation failed
    await User.findOneAndDelete({ username: normalizedUsername });
    throw error;
  }
};

/**
 * Login user
 */
export const loginUser = async (username, password) => {
  const normalizedUsername = username.toLowerCase().trim();
  const user = await User.findOne({ username: normalizedUsername });
  
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};

/**
 * Refresh access token
 */
export const refreshToken = async (token) => {
  // Verify token signature
  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded.id);
  
  if (!user) {
    throw new Error("Invalid refresh token");
  }

  // Find matching token in database
  let tokenIndex = -1;
  for (let i = 0; i < user.refreshTokens.length; i++) {
    const isMatch = await bcrypt.compare(token, user.refreshTokens[i].token);
    if (isMatch) {
      tokenIndex = i;
      break;
    }
  }

  if (tokenIndex === -1) {
    throw new Error("Refresh token revoked");
  }

  // Remove old token (rotation)
  user.refreshTokens.splice(tokenIndex, 1);
  await user.save();

  return user;
};

/**
 * Logout user - remove refresh token
 */
export const logoutUser = async (token) => {
  if (!token) {
    return;
  }

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    
    if (user) {
      // Remove matching refresh token
      const updatedTokens = [];
      for (const rt of user.refreshTokens) {
        const isMatch = await bcrypt.compare(token, rt.token);
        if (!isMatch) {
          updatedTokens.push(rt);
        }
      }
      user.refreshTokens = updatedTokens;
      await user.save();
    }
  } catch (e) {
    // Token invalid - continue with logout
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password -refreshTokens");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

