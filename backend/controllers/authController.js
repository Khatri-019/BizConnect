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
// For production (HTTPS): use sameSite: "none" to allow cross-origin cookies
// For development (HTTP): use sameSite: "lax" (secure must be false)
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax", // "none" required for cross-origin cookies with secure: true
  path: "/", // Explicitly set path to root - CRITICAL for cross-origin cookies
};

const ACCESS_TOKEN_MAX_AGE = 1000 * 60 * 15; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days

// ============ HELPERS ============

/**
 * Creates tokens and sets cookies for a user
 */
const setAuthCookies = async (res, user) => {
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

  // Debug logging in production
  if (process.env.NODE_ENV === "production") {
    console.log("Cookies set with options:", {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
    });
  }
};

// ============ CONTROLLERS ============

/**
 * Check if username is available
 * POST /api/auth/check-username
 */
export const checkUsername = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const existingUser = await User.findOne({ 
      username: username.toLowerCase().trim() 
    });

    if (existingUser) {
      return res.status(409).json({ 
        message: "Username is taken", 
        available: false 
      });
    }

    return res.status(200).json({ 
      message: "Username available", 
      available: true 
    });
  } catch (error) {
    console.error("Check username error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Register a new user (basic registration)
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { username, password, role = "user" } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const existingUser = await User.findOne({ 
      username: username.toLowerCase().trim() 
    });
    
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({
      username: username.toLowerCase().trim(),
      password,
      role,
    });
    
    await newUser.save();
    await setAuthCookies(res, newUser);

    return res.status(201).json({
      message: "Registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

/**
 * Register expert (user + expert profile in one transaction)
 * POST /api/auth/expert-register
 */
export const registerExpert = async (req, res) => {
  const {
    username,
    password,
    img,
    name,
    industry,
    location,
    experienceYears,
    description,
    rating,
    pricing,
  } = req.body;

  // Validation
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!name || !img || !pricing) {
    return res.status(400).json({ message: "Name, image, and pricing required" });
  }

  try {
    // Check if username exists
    const existingUser = await User.findOne({ 
      username: username.toLowerCase().trim() 
    });
    
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // Create user
    const newUser = new User({
      username: username.toLowerCase().trim(),
      password,
      role: "expert",
    });
    
    await newUser.save();

    // Create expert profile
    const expertProfile = new Expert({
      _id: newUser._id, // Link to user
      img,
      name: name.trim(),
      industry: industry?.trim(),
      location: location?.trim(),
      experienceYears,
      description: description?.trim(),
      rating: rating || 0,
      pricing,
    });

    await expertProfile.save();

    // Set auth cookies
    await setAuthCookies(res, newUser);

    return res.status(201).json({
      message: "Expert account created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    // Cleanup: Delete user if expert creation failed
    if (error.message.includes("Expert")) {
      await User.findOneAndDelete({ username: username.toLowerCase().trim() });
    }
    
    console.error("Expert registration error:", error);
    return res.status(500).json({
      message: error.message || "Registration failed",
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const user = await User.findOne({ 
      username: username.toLowerCase().trim() 
    });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await setAuthCookies(res, user);

    return res.json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    
    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // Verify token signature
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
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
      return res.status(401).json({ message: "Refresh token revoked" });
    }

    // Remove old token (rotation)
    user.refreshTokens.splice(tokenIndex, 1);

    // Issue new tokens
    await setAuthCookies(res, user);

    return res.json({ message: "Token refreshed" });
  } catch (error) {
    console.error("Refresh error:", error);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    
    if (token) {
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
    }

    // Clear cookies - MUST use same options as when setting them
    res.clearCookie("accessToken", {
      ...cookieOptions,
      path: "/", // Explicitly set path when clearing
    });
    res.clearCookie("refreshToken", {
      ...cookieOptions,
      path: "/", // Explicitly set path when clearing
    });

    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    // Still clear cookies on error
    res.clearCookie("accessToken", {
      ...cookieOptions,
      path: "/",
    });
    res.clearCookie("refreshToken", {
      ...cookieOptions,
      path: "/",
    });
    return res.json({ message: "Logged out" });
  }
};

/**
 * Get current user
 * GET /api/auth/me (protected)
 */
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -refreshTokens");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      id: user._id,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ message: "Failed to get user" });
  }
};
