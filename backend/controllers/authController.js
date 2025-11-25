import User from "../models/user.js";
import Expert from "../models/expert.js";


import { createAccessToken, createRefreshToken, hashToken, verifyRefreshToken } from "../utils/token.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

export const register = async (req, res) => {
  const { username,password, role } = req.body;
  if (!password || !username) return res.status(400).json({ message: "Missing fields" });

  const existing = await User.findOne({ username });
  if (existing) return res.status(409).json({ message: "User already exists" });

  const newUser = new User({ username,password, role });
  await newUser.save();

  // create tokens
  const accessToken = createAccessToken({ id: newUser._id, role: newUser.role });
  const refreshToken = createRefreshToken({ id: newUser._id, role: newUser.role });

  // store hashed refresh token
  const hashed = await hashToken(refreshToken);
  newUser.refreshTokens.push({ token: hashed, createdAt: new Date(), expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });
  await newUser.save();

  // set cookies
  res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 15 }); // 15m
  res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 7 }); // 7d

  res.status(201).json({ message: "Registered", newUser: { id: newUser._id, username: newUser.username, role: newUser.role } });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await user.matchPassword(password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = createAccessToken({ id: user._id, role: user.role });
  const refreshToken = createRefreshToken({ id: user._id, role: user.role });

  const hashed = await hashToken(refreshToken);

  if (user.refreshTokens.length > 5) {
  user.refreshTokens = user.refreshTokens.slice(-5);
  }

  user.refreshTokens.push({ token: hashed, createdAt: new Date(), expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });
  // optionally limit number of refresh tokens stored per user
  await user.save();

  res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 15 });
  res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 7 });

  res.json({ message: "Logged in", user: { id: user._id, username: user.username,role: user.role } });
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    // verify signature
    const decoded = verifyRefreshToken(token); // may throw
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "Invalid refresh token" });

    // verify token exists in DB (compare hashed)
    const matchFound = await Promise.all(user.refreshTokens.map(async rt => await bcrypt.compare(token, rt.token)));
    if (!matchFound.some(Boolean)) {
      // token not found -> maybe stolen or revoked
      return res.status(401).json({ message: "Refresh token revoked" });
    }

    // rotate: remove the matched token and issue new
    // find index
    const idx = user.refreshTokens.findIndex(rt => bcrypt.compareSync(token, rt.token));
    if (idx !== -1) user.refreshTokens.splice(idx, 1);

    // issue new tokens
    const newAccess = createAccessToken({ id: user._id, role: user.role });
    const newRefresh = createRefreshToken({ id: user._id, role: user.role });
    const newHashed = await hashToken(newRefresh);
    user.refreshTokens.push({ token: newHashed, createdAt: new Date(), expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });
    await user.save();

    // set cookies
    res.cookie("accessToken", newAccess, { ...cookieOptions, maxAge: 1000 * 60 * 15 });
    res.cookie("refreshToken", newRefresh, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 7 });

    res.json({ message: "Refreshed" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      // remove this refresh token from DB
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshTokens = await Promise.all(user.refreshTokens.filter(rt => !bcrypt.compareSync(token, rt.token)));
        await user.save();
      }
    }

    // clear cookies
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    res.json({ message: "Logged out" });
  } catch (err) {
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.json({ message: "Logged out" });
  }
};

export const me = async (req, res) => {
  // req.user set by protect middleware
  const user = await User.findById(req.user.id).select("-password -refreshTokens");
  res.json(user);
};




export const registerExpert = async (req, res) => {
  const { username, password, img, name, industry, location, experienceYears, description, rating, pricing } = req.body;
  
  // 1. Basic Validation and Existence Check
  if (!username || !password) return res.status(400).json({ message: "Missing username or password" });

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(409).json({ message: "User already exists" });

  // 2. Create User (Mongoose uses nanoid() for _id)
  const newUser = new User({ username, password, role: "expert" }); 
  
  try {
    await newUser.save(); 
    
    // 3. Create and Save Expert Profile
    const expertProfile = new Expert({
      _id: newUser._id, // CRITICAL: Link using the new User ID
      img, name, industry, location, experienceYears, description, rating, pricing,
    });
    
    await expertProfile.save(); 
    
    // 4. If both succeed, create tokens and respond
    const accessToken = createAccessToken({ id: newUser._id, role: newUser.role });
    const refreshToken = createRefreshToken({ id: newUser._id, role: newUser.role });
    const hashed = await hashToken(refreshToken);

    // Save refresh tokens to user document
    newUser.refreshTokens.push({ token: hashed, createdAt: new Date(), expiresAt: new Date(Date.now() + 7*24*60*60*1000) });
    await newUser.save(); 

    // Cookies (adjust secure:false for dev environment)
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: false }); 
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });

    return res.status(201).json({ message: "Expert account created successfully." });

  } catch (error) {
    // 5. CLEANUP: If the Expert save fails, DELETE the User
    if (newUser._id) {
      await User.findByIdAndDelete(newUser._id);
    }
    console.error("Combined registration failed. User deleted due to profile error:", error.message);
    return res.status(500).json({ 
      message: error.message || "Profile creation failed. Account aborted." 
    });
  }
};

export const checkUsername = async (req, res) => {
  const { username } = req.body;
  
  if (!username) return res.status(400).json({ message: "Username is required" });

  const existingUser = await User.findOne({ username });
  
  if (existingUser) {
    return res.status(409).json({ message: "Username is taken", available: false });
  }
  
  return res.status(200).json({ message: "Username available", available: true });
};
