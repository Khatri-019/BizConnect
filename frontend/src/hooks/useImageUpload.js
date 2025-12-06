import { useState } from "react";
import axios from "axios";
import { expertsAPI } from "../services/api";

// Cloudinary config - should be moved to env variables in production
const CLOUD_NAME = "durgw6vpo";
const UPLOAD_PRESET = "expert_profile_images";

/**
 * Hook for handling image uploads to Cloudinary
 * Returns upload function, uploading state, and error state
 */
export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    if (!file) {
      setError("No file provided");
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      // TODO: In production, get signed upload signature from backend
      // For now, using unsigned preset (less secure but works)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        { withCredentials: false } // Don't send cookies to Cloudinary
      );

      setUploading(false);
      return res.data.secure_url;
    } catch (err) {
      console.error("Upload error:", err);
      setError("Image upload failed. Please try again.");
      setUploading(false);
      return null;
    }
  };

  return {
    uploadImage,
    uploading,
    error,
  };
};

