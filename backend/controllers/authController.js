import * as authService from "../services/authService.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

// Cookie configuration for clearing
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

/**
 * Check if username is available
 * POST /api/auth/check-username
 */
export const checkUsername = asyncHandler(async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  const isAvailable = await authService.checkUsernameAvailability(username);

  if (!isAvailable) {
    return res.status(409).json({ 
      message: "Username is taken", 
      available: false 
    });
  }

  return res.status(200).json({ 
    message: "Username available", 
    available: true 
  });
});

/**
 * Register a new user (basic registration)
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { username, password, role = "user" } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const newUser = await authService.registerUser(username, password, role);
  await authService.setAuthCookies(res, newUser);

  return res.status(201).json({
    message: "Registered successfully",
    user: {
      id: newUser._id,
      username: newUser.username,
      role: newUser.role,
    },
  });
});

/**
 * Register expert (user + expert profile in one transaction)
 * POST /api/auth/expert-register
 */
export const registerExpert = asyncHandler(async (req, res) => {
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

  const newUser = await authService.registerExpert(
    { username, password },
    { img, name, industry, location, experienceYears, description, rating, pricing }
  );

  // Set auth cookies
  await authService.setAuthCookies(res, newUser);

  return res.status(201).json({
    message: "Expert account created successfully",
    user: {
      id: newUser._id,
      username: newUser.username,
      role: newUser.role,
    },
  });
});

/**
 * Login user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const user = await authService.loginUser(username, password);
  await authService.setAuthCookies(res, user);

  return res.json({
    message: "Logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
  });
});

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  
  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  const user = await authService.refreshToken(token);
  await authService.setAuthCookies(res, user);

  return res.json({ message: "Token refreshed" });
});

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  
  await authService.logoutUser(token);

  // Clear cookies
  res.clearCookie("accessToken", {
    ...cookieOptions,
    path: "/",
  });
  res.clearCookie("refreshToken", {
    ...cookieOptions,
    path: "/",
  });

  return res.json({ message: "Logged out successfully" });
});

/**
 * Get current user
 * GET /api/auth/me (protected)
 */
export const me = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user.id);

  return res.json({
    id: user._id,
    username: user.username,
    role: user.role,
  });
});
