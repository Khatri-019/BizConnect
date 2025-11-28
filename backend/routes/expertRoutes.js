import express from "express";
import Expert from "../models/expert.js";
import { protect, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// ============ PUBLIC ROUTES ============

/**
 * Get all experts
 * GET /api/experts
 */
router.get("/", async (req, res) => {
  try {
    const experts = await Expert.find({}).sort({ createdAt: -1 });
    return res.status(200).json(experts);
  } catch (error) {
    console.error("Error fetching experts:", error.message);
    return res.status(500).json({ 
      message: "Failed to fetch experts" 
    });
  }
});

/**
 * Get single expert by ID
 * GET /api/experts/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }
    
    return res.status(200).json(expert);
  } catch (error) {
    console.error("Error fetching expert:", error.message);
    return res.status(500).json({ 
      message: "Failed to fetch expert" 
    });
  }
});

// ============ PROTECTED ROUTES ============

/**
 * Update expert profile (only the owner can update)
 * PUT /api/experts/:id
 */
router.put("/:id", protect, async (req, res) => {
  try {
    // Verify the user owns this profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ 
        message: "Not authorized to update this profile" 
      });
    }

    const { name, industry, location, experienceYears, description, pricing, img } = req.body;

    const updatedExpert = await Expert.findByIdAndUpdate(
      req.params.id,
      { name, industry, location, experienceYears, description, pricing, img },
      { new: true, runValidators: true }
    );

    if (!updatedExpert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    return res.status(200).json(updatedExpert);
  } catch (error) {
    console.error("Error updating expert:", error.message);
    return res.status(500).json({ 
      message: "Failed to update expert" 
    });
  }
});

/**
 * Delete expert profile (admin only)
 * DELETE /api/experts/:id
 */
router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const deletedExpert = await Expert.findByIdAndDelete(req.params.id);
    
    if (!deletedExpert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    return res.status(200).json({ 
      message: "Expert deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting expert:", error.message);
    return res.status(500).json({ 
      message: "Failed to delete expert" 
    });
  }
});

export default router;
