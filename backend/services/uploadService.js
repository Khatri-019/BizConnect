import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Generate signed upload parameters for secure client-side upload
 * This prevents unauthorized uploads to Cloudinary
 */
export const generateUploadSignature = (folder = "expert_profile_images") => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      max_file_size: 5000000, // 5MB
    },
    process.env.CLOUDINARY_API_SECRET
  );

  return {
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
  };
};

/**
 * Extract public_id from Cloudinary URL
 */
export const extractPublicId = (url) => {
  if (!url) return null;
  try {
    const parts = url.split("/");
    const uploadIndex = parts.findIndex(part => part === "upload");
    if (uploadIndex === -1) return null;
    
    const afterUpload = parts.slice(uploadIndex + 1);
    if (afterUpload.length === 0) return null;
    
    let publicIdWithExt = afterUpload.join("/");
    publicIdWithExt = publicIdWithExt.replace(/^v\d+\//, "").replace(/^\d+\//, "");
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
    
    return publicId || null;
  } catch (error) {
    console.error("Error extracting public_id:", error);
    return null;
  }
};

/**
 * Delete image from Cloudinary
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

