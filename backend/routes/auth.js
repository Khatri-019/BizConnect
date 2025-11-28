import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  me,
  registerExpert,
  checkUsername,
} from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// ============ PUBLIC ROUTES ============

// Check username availability
router.post("/check-username", checkUsername);

// Register new user (basic)
router.post("/register", register);

// Register new expert (user + profile)
router.post("/expert-register", registerExpert);

// Login
router.post("/login", login);

// Refresh access token
router.post("/refresh", refresh);

// Logout
router.post("/logout", logout);

// ============ PROTECTED ROUTES ============

// Get current user
router.get("/me", protect, me);

export default router;
