import express from "express";
import Expert from "../models/expert.js";
import User from "../models/user.js";
import { protect, authorizeRoles } from "../middlewares/auth.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to extract public_id from Cloudinary URL
function extractPublicId(url) {
  if (!url) return null;
  try {
    // Cloudinary URL formats:
    // https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
    // https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{format}
    // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    
    const parts = url.split("/");
    const uploadIndex = parts.findIndex(part => part === "upload");
    if (uploadIndex === -1) return null;
    
    // Get the part after upload
    const afterUpload = parts.slice(uploadIndex + 1);
    if (afterUpload.length === 0) return null;
    
    // Join all parts after upload
    let publicIdWithExt = afterUpload.join("/");
    
    // Remove version prefix if present (v1234567890 or just numbers)
    publicIdWithExt = publicIdWithExt.replace(/^v\d+\//, "").replace(/^\d+\//, "");
    
    // Remove file extension
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
    
    return publicId || null;
  } catch (error) {
    console.error("Error extracting public_id:", error);
    return null;
  }
}

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

/**
 * Delete user profile (deletes user, expert, and Cloudinary image)
 * DELETE /api/experts/:id/profile
 */
router.delete("/:id/profile", protect, async (req, res) => {
  try {
    // Verify the user owns this profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ 
        message: "Not authorized to delete this profile" 
      });
    }

    // Find expert to get image URL
    const expert = await Expert.findById(req.params.id);
    
    if (!expert) {
      return res.status(404).json({ message: "Expert profile not found" });
    }

    // Delete image from Cloudinary if it exists
    if (expert.img) {
      const publicId = extractPublicId(expert.img);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted image from Cloudinary: ${publicId}`);
        } catch (cloudinaryError) {
          console.error("Error deleting image from Cloudinary:", cloudinaryError);
          // Continue with deletion even if Cloudinary deletion fails
        }
      }
    }

    // Delete expert profile
    await Expert.findByIdAndDelete(req.params.id);

    // Delete user account
    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({ 
      message: "Profile deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting profile:", error.message);
    return res.status(500).json({ 
      message: "Failed to delete profile" 
    });
  }
});

export default router;
