import React, { useState } from "react";
import axios from "axios";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expertValidationSchema } from "./expertValidationSchema";
import { LuUpload, LuUser, LuBriefcase, LuMapPin, LuCalendar, LuFileText, LuStar, LuDollarSign, LuLoader } from "react-icons/lu";
import SignupCard from "./SignupCard";
import Button from "./Button";
import Input from "./Input";
import Label from "./Label";
import Textarea from "./Textarea";
import "./ExpertSignupForm.css";

function ExpertSignupForm() {
  const CLOUD_NAME = "durgw6vpo";
  const UPLOAD_PRESET = "expert_profile_images";

  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
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
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        data
      );

      setValue("img", res.data.secure_url);
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const expertWithId = {
        _id: nanoid(),
        ...data,
      };

      await axios.post("http://localhost:5000/api/experts", expertWithId);

      alert("Expert created successfully!");
      reset();
      setPreviewImage(null);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="expert-signup-container">
      <div className="expert-signup-wrapper">
        <SignupCard>
          <div className="card-header">
            <h1 className="card-title">Become an Expert</h1>
            <p className="card-description">
              Share your expertise and connect with those who need your knowledge
            </p>
          </div>

          <div className="card-content">
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
                        <LuLoader className="spinner" />
                        Uploading...
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
                  <LuUser className="label-icon" />
                  Full Name
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
                  <LuBriefcase className="label-icon" />
                  Industry
                </Label>
                <Input
                  id="industry"
                  {...register("industry")}
                  placeholder="e.g., Software Engineering, Marketing"
                />
                {errors.industry && (
                  <p className="error-message">{errors.industry.message}</p>
                )}
              </div>

              {/* LOCATION */}
              <div className="form-group">
                <Label htmlFor="location">
                  <LuMapPin className="label-icon" />
                  Location
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
                  <LuCalendar className="label-icon" />
                  Experience (Years)
                </Label>
                <Input
                  id="experience"
                  type="number"
                  {...register("experienceYears", { valueAsNumber: true })}
                  placeholder="Years of experience"
                />
                {errors.experienceYears && (
                  <p className="error-message">
                    {errors.experienceYears.message}
                  </p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div className="form-group">
                <Label htmlFor="description">
                  <LuFileText className="label-icon" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Tell us about your expertise and what makes you unique..."
                  rows={4}
                />
                {errors.description && (
                  <p className="error-message">{errors.description.message}</p>
                )}
              </div>

              <div className="form-row">
                {/* RATING */}
                <div className="form-group">
                  <Label htmlFor="rating">
                    <LuStar className="label-icon" />
                    Rating (Optional)
                  </Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    {...register("rating", { valueAsNumber: true })}
                    placeholder="0.0 - 5.0"
                  />
                  {errors.rating && (
                    <p className="error-message">{errors.rating.message}</p>
                  )}
                </div>

                {/* PRICING */}
                <div className="form-group">
                  <Label htmlFor="pricing">
                    <LuDollarSign className="label-icon" />
                    Pricing ($/hour)
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
                {isSubmitting || uploading ? (
                  <>
                    <LuLoader className="button-icon spinner" />
                    Processing...
                  </>
                ) : (
                  "Create Expert Profile"
                )}
              </Button>
            </form>
          </div>
        </SignupCard>
      </div>
    </div>
  );
}

export default ExpertSignupForm;
