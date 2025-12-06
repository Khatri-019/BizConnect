import * as expertService from "../services/expertService.js";
import * as uploadService from "../services/uploadService.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

/**
 * Get all experts
 * GET /api/experts
 */
export const getAllExperts = asyncHandler(async (req, res) => {
  // Get logged-in user ID if available (from optional auth middleware)
  const excludeUserId = req.user?.id || null;
  
  const experts = await expertService.getAllExperts(excludeUserId);
  return res.status(200).json(experts);
});

/**
 * Get single expert by ID
 * GET /api/experts/:id
 */
export const getExpertById = asyncHandler(async (req, res) => {
  const expert = await expertService.getExpertById(req.params.id);
  return res.status(200).json(expert);
});

/**
 * Update expert profile (only the owner can update)
 * PUT /api/experts/:id
 */
export const updateExpert = asyncHandler(async (req, res) => {
  // Verify the user owns this profile
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ 
      message: "Not authorized to update this profile" 
    });
  }

  const updatedExpert = await expertService.updateExpertProfile(
    req.params.id,
    req.body
  );

  return res.status(200).json(updatedExpert);
});

/**
 * Delete expert profile (admin only)
 * DELETE /api/experts/:id
 */
export const deleteExpert = asyncHandler(async (req, res) => {
  await expertService.deleteExpertProfile(req.params.id);
  
  return res.status(200).json({ 
    message: "Expert deleted successfully" 
  });
});

/**
 * Delete user profile (deletes user, expert, and Cloudinary image)
 * DELETE /api/experts/:id/profile
 */
export const deleteProfile = asyncHandler(async (req, res) => {
  // Verify the user owns this profile
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ 
      message: "Not authorized to delete this profile" 
    });
  }

  const { expertId, imageUrl } = await expertService.deleteExpertProfile(req.params.id);

  // Delete image from Cloudinary if it exists
  if (imageUrl) {
    const publicId = uploadService.extractPublicId(imageUrl);
    if (publicId) {
      try {
        await uploadService.deleteImage(publicId);
        console.log(`Deleted image from Cloudinary: ${publicId}`);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        // Continue with deletion even if Cloudinary deletion fails
      }
    }
  }

  return res.status(200).json({ 
    message: "Profile deleted successfully" 
  });
});

/**
 * Get Cloudinary upload signature for secure upload
 * GET /api/experts/upload-signature
 */
export const getUploadSignature = asyncHandler(async (req, res) => {
  const signature = uploadService.generateUploadSignature();
  return res.status(200).json(signature);
});

