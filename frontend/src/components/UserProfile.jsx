import React, { useState, useEffect } from "react";
import { expertsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import "./UserProfile.css";

function UserProfile({ onEdit, onDelete }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        const expertProfile = await expertsAPI.getById(user.id);
        setProfile(expertProfile);
      } catch (err) {
        setError("Failed to load profile.");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!profile) return <div className="profile-error">Profile not found</div>;

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <div className="profile-image-container">
          <img src={profile.img} alt={profile.name} className="profile-image" />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{profile.name}</h1>
          <div className="profile-rating">
            <StarRoundedIcon sx={{ color: "#ffc509", fontSize: "2.5rem" }} />
            <span className="rating-value">{profile.rating || 0}</span>
          </div>
        </div>
      </div>

      <div className="profile-details">
        <div className="profile-detail-item">
          <span className="detail-label">Industry:</span>
          <span className="detail-value">{profile.industry || "Not specified"}</span>
        </div>
        <div className="profile-detail-item">
          <span className="detail-label">Location:</span>
          <span className="detail-value">
            <LocationPinIcon sx={{ fontSize: "1.5rem", marginRight: "0.5rem" }} />
            {profile.location || "Not specified"}
          </span>
        </div>
        <div className="profile-detail-item">
          <span className="detail-label">Experience:</span>
          <span className="detail-value">
            <CalendarTodayRoundedIcon sx={{ fontSize: "1.5rem", marginRight: "0.5rem" }} />
            {profile.experienceYears} years
          </span>
        </div>
        <div className="profile-detail-item">
          <span className="detail-label">Pricing:</span>
          <span className="detail-value">${profile.pricing}/hr</span>
        </div>
        <div className="profile-detail-item full-width">
          <span className="detail-label">Description:</span>
          <p className="detail-value description-text">{profile.description || "No description provided"}</p>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn btn-primary profile-action-btn" onClick={onEdit}>
          Edit Profile
        </button>
        <button className="btn btn-danger profile-action-btn" onClick={onDelete}>
          Delete Profile
        </button>
      </div>
    </div>
  );
}

export default UserProfile;

