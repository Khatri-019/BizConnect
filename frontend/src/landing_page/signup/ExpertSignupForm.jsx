import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expertValidationSchema } from "./expertValidationSchema";
import { authAPI, expertsAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  LuUpload,
  LuUser,
  LuBriefcase,
  LuMapPin,
  LuCalendar,
  LuFileText,
  LuDollarSign,
  LuLoader,
  LuArrowLeft,
} from "react-icons/lu";
import SignupCard from "./SignupCard";
import { Button, Input, Label, Textarea } from "../../form_ui";
import "./ExpertSignupForm.css";

// Cloudinary config
const CLOUD_NAME = "durgw6vpo";
const UPLOAD_PRESET = "expert_profile_images";

function ExpertSignupForm({ credentials, onBack, mode = "signup", onCancel, onSuccess }) {
  const { closeSignup, setAuthUser, user } = useAuth();
  const isEditMode = mode === "edit";
  
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(isEditMode);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(expertValidationSchema),
  });

  const imgValue = watch("img"); // Watch the img field value

  // Load existing profile data when in edit mode
  useEffect(() => {
    if (isEditMode && user?.id) {
      const loadProfile = async () => {
        try {
          const profile = await expertsAPI.getById(user.id);
          // Pre-fill form with existing data
          reset({
            name: profile.name || "",
            industry: profile.industry || "",
            location: profile.location || "",
            experienceYears: profile.experienceYears || 0,
            description: profile.description || "",
            pricing: profile.pricing || 0,
            img: profile.img || "",
          });
          setPreviewImage(profile.img || null);
        } catch (error) {
          console.error("Failed to load profile:", error);
          setSubmitError("Failed to load profile data.");
        } finally {
          setLoadingProfile(false);
        }
      };
      loadProfile();
    }
  }, [isEditMode, user, reset]);

  // Upload image to Cloudinary
  const uploadToCloudinary = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      setUploading(true);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        { withCredentials: false } // Don't send cookies to Cloudinary
      );
      setValue("img", res.data.secure_url, { shouldValidate: true });
    } catch (err) {
      console.error("Upload error:", err);
      setSubmitError("Image upload failed. Please try again.");
      setValue("img", "", { shouldValidate: true });
      setPreviewImage(null);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitError("");
    
    try {
      if (isEditMode) {
        // Update existing profile
        await expertsAPI.updateProfile(user.id, data);
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        // Register new expert
        const payload = {
          username: credentials.username,
          password: credentials.password,
          ...data,
        };

        // Register expert - backend sets JWT cookies
        const response = await authAPI.registerExpert(payload);

        // Set user in context (cookies already set by backend)
        setAuthUser({
          username: credentials.username,
          role: "expert",
        });

        // Close modal - navigation happens via AuthContext
        closeSignup();
        
        // Optionally redirect
        window.location.href = "/experts";
      }
    } catch (error) {
      const message = error.response?.data?.message || 
        (isEditMode ? "Failed to update profile. Please try again." : "Registration failed. Please try again.");
      setSubmitError(message);
    }
  };

  if (loadingProfile) {
    return (
      <SignupCard className="signup-card-step-2">
        <div className="signup-card-content">
          <p style={{ textAlign: "center", fontSize: "1.6rem" }}>Loading profile...</p>
        </div>
      </SignupCard>
    );
  }

  return (
    <SignupCard className="signup-card-step-2">
      <div className="signup-card-header">
        <h1 className="signup-card-title">{isEditMode ? "Edit Expert Profile" : "Expert Profile"}</h1>
        <p className="signup-card-description">
          {isEditMode 
            ? "Update your expert profile information."
            : "Tell us more about your expertise to get listed."}
        </p>
      </div>

      <div className="signup-card-content">
        <form onSubmit={handleSubmit(onSubmit)} className="expert-form">
          {/* IMAGE UPLOAD */}
          <div className="form-group">
            <Label htmlFor="image-upload">
              <LuUpload className="label-icon" />
              Profile Image
            </Label>
            <div className="image-upload-section">
              <div className="preview-container">
                {(previewImage || imgValue) ? (
                  <div className="preview-image-wrapper">
                    <img
                      src={previewImage || imgValue}
                      className="preview-image"
                      alt="Preview"
                    />
                    <div className="preview-overlay" />
                  </div>
                ) : (
                  <div className="preview-placeholder">
                    <LuUser className="placeholder-icon" />
                  </div>
                )}
              </div>
              <div className="upload-input-wrapper">
                <input
                  id="image-upload"
                  type="file"
                  className="input file-input"
                  onChange={uploadToCloudinary}
                  accept="image/*"
                />
                {uploading && (
                  <p className="upload-status">
                    <LuLoader className="spinner" /> Uploading...
                  </p>
                )}
              </div>
            </div>
            {errors.img && (
              <p className="error-message">{errors.img.message}</p>
            )}
          </div>

          {/* NAME */}
          <div className="form-group">
            <Label htmlFor="name">
              <LuUser className="label-icon" /> Full Name
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>

          {/* INDUSTRY */}
          <div className="form-group">
            <Label htmlFor="industry">
              <LuBriefcase className="label-icon" /> Industry
            </Label>
            <Input
              id="industry"
              {...register("industry")}
              placeholder="e.g., Software Engineering"
            />
            {errors.industry && (
              <p className="error-message">{errors.industry.message}</p>
            )}
          </div>

          {/* LOCATION */}
          <div className="form-group">
            <Label htmlFor="location">
              <LuMapPin className="label-icon" /> Location
            </Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="City, Country"
            />
            {errors.location && (
              <p className="error-message">{errors.location.message}</p>
            )}
          </div>

          {/* EXPERIENCE */}
          <div className="form-group">
            <Label htmlFor="experience">
              <LuCalendar className="label-icon" /> Experience (Years)
            </Label>
            <Input
              id="experience"
              type="number"
              {...register("experienceYears", { valueAsNumber: true })}
              placeholder="Years of experience"
            />
            {errors.experienceYears && (
              <p className="error-message">{errors.experienceYears.message}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <Label htmlFor="description">
              <LuFileText className="label-icon" /> Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Tell us about your expertise..."
              rows={4}
            />
            {errors.description && (
              <p className="error-message">{errors.description.message}</p>
            )}
          </div>

          {/* PRICING */}
          <div className="form-group">
            <Label htmlFor="pricing">
              <LuDollarSign className="label-icon" /> Pricing ($/hr)
            </Label>
            <Input
              id="pricing"
              type="number"
              {...register("pricing", { valueAsNumber: true })}
              placeholder="Hourly rate"
            />
            {errors.pricing && (
              <p className="error-message">{errors.pricing.message}</p>
            )}
          </div>

          {/* ERROR MESSAGE */}
          {submitError && (
            <p className="error-message" style={{ textAlign: "center" }}>
              {submitError}
            </p>
          )}

          {/* BUTTONS */}
          <div className="form-buttons" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            {isEditMode ? (
              <>
                <Button
                  type="button"
                  className="back-button"
                  onClick={onCancel}
                  style={{ flex: 1, background: "#6b7280" }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting || uploading}
                  style={{ flex: 2 }}
                >
                  {isSubmitting ? (
                    <>
                      <LuLoader className="button-icon spinner" />
                      Updating Profile...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  className="back-button"
                  onClick={onBack}
                  style={{ flex: 1, background: "#6b7280" }}
                >
                  <LuArrowLeft /> Back
                </Button>
                <Button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting || uploading}
                  style={{ flex: 2 }}
                >
                  {isSubmitting ? (
                    <>
                      <LuLoader className="button-icon spinner" />
                      Creating Profile...
                    </>
                  ) : (
                    "Create Expert Profile"
                  )}
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </SignupCard>
  );
}

export default ExpertSignupForm;
