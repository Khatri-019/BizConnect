import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expertValidationSchema } from "./expertValidationSchema";
import {  LuUpload, LuUser, LuBriefcase, LuMapPin,LuCalendar,LuFileText,LuStar,LuDollarSign,LuLoader,} from "react-icons/lu";
import { useSignup } from "../../context/SignupContext";
import SignupCard from "./SignupCard";
import Button from "./Button";
import Input from "./Input";
import Label from "./Label";
import Textarea from "./Textarea";
import "./ExpertSignupForm.css";
import { useAuth } from "../../context/AuthContext";

// Accepted props: userId (from Step 1)
function ExpertSignupForm({ credentials }) {
  const { closeSignup } = useSignup();
  const { login } = useAuth();
  const CLOUD_NAME = "durgw6vpo";
  const UPLOAD_PRESET = "expert_profile_images";

  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(expertValidationSchema),
  });

  const uploadToCloudinary = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    try {
      setUploading(true);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,data,{withCredentials:false}
      );
      // Success: Set the URL
      setValue("img", res.data.secure_url, { shouldValidate: true });
    } catch (err) {
      // Failure: Clear the URL and inform the user
      console.error("upload error ",err);
      alert("Image upload failed"); //
      setValue("img", "", { shouldValidate: true }); // <--- CRITICAL: Reset value
    } finally {
      setUploading(false);
    }
  };

const onSubmit = async (data) => {
    try {
      const combinedData = {
        username: credentials.username,
        password: credentials.password,
        ...data,
      };

      // 1. Register User (Backend sets cookies)
      await axios.post("http://localhost:5000/api/auth/expert-register", combinedData);

      alert("Expert Profile Created Successfully!");
      
      // 2. Auto-Login locally
      const newUser = { username: credentials.username, role: 'expert' };
      login(newUser); // Redirects to /experts via Context
      
      // 3. Close Modal
      closeSignup();

    } catch (error) {
      alert(error.response?.data?.message || "Profile creation failed.");
    }
  };
  
  return (
    <SignupCard className="signup-card-step-2">

      
      <div className="signup-card-header">
        <h1 className="signup-card-title">Expert Profile</h1>
        <p className="signup-card-description">
          Tell us more about your expertise to get listed.
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
                {previewImage ? (
                  <div className="preview-image-wrapper">
                    <img
                      src={previewImage}
                      className="preview-image"
                      alt="preview"
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
                <Input
                  id="image-upload"
                  type="file"
                  className="file-input"
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

          {/* RATING & PRICING */}
          <div className="form-row">
            {/* <div className="form-group">
              <Label htmlFor="rating"><LuStar className="label-icon" /> Rating (Optional)</Label>
              <Input 
                id="rating" 
                type="number" 
                step="0.1" 
                {...register("rating", { valueAsNumber: true })} 
                placeholder="0.0 - 5.0" 
              />
            </div> */}
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
          </div>

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            className="submit-button"
            disabled={isSubmitting || uploading}
          >
            {isSubmitting ? (
              <>
                <LuLoader className="button-icon spinner" />
                Finalizing Profile...
              </>
            ) : (
              "Create Expert Profile"
            )}
          </Button>
        </form>
      </div>
    </SignupCard>
  );
}

export default ExpertSignupForm;
