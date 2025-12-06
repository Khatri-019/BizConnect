import express from "express";
import {
  getAllExperts,
  getExpertById,
  updateExpert,
  deleteExpert,
  deleteProfile,
  getUploadSignature,
} from "../controllers/expertController.js";
import { protect, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// ============ PUBLIC ROUTES ============

/**
 * Get all experts
 * GET /api/experts
 */
router.get("/", getAllExperts);

/**
 * Get single expert by ID
 * GET /api/experts/:id
 */
router.get("/:id", getExpertById);

/**
 * Get Cloudinary upload signature for secure upload
 * GET /api/experts/upload-signature
 */
router.get("/upload-signature", protect, getUploadSignature);

// ============ PROTECTED ROUTES ============

/**
 * Update expert profile (only the owner can update)
 * PUT /api/experts/:id
 */
router.put("/:id", protect, updateExpert);

/**
 * Delete expert profile (admin only)
 * DELETE /api/experts/:id
 */
router.delete("/:id", protect, authorizeRoles("admin"), deleteExpert);

/**
 * Delete user profile (deletes user, expert, and Cloudinary image)
 * DELETE /api/experts/:id/profile
 */
router.delete("/:id/profile", protect, deleteProfile);

export default router;
