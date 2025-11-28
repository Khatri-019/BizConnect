import React, { useState, useEffect } from "react";
import { LuX } from "react-icons/lu";
import UserProfile from "./UserProfile";
import ExpertSignupForm from "../landing_page/signup/ExpertSignupForm";
import "./ProfileModal.css";

function ProfileModal({ isOpen, onClose, onProfileUpdated, onProfileDeleted, initialView = "profile" }) {
  const [view, setView] = useState(initialView); // "profile" or "edit"

  // Reset view when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
    }
  }, [isOpen, initialView]);

  const handleEdit = () => {
    setView("edit");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      onProfileDeleted();
    }
  };

  const handleEditCancel = () => {
    setView("profile");
  };

  const handleEditSuccess = () => {
    setView("profile");
    if (onProfileUpdated) {
      onProfileUpdated();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="profile-modal-close" onClick={onClose}>
          <LuX size={24} />
        </button>
        
        {view === "profile" ? (
          <UserProfile 
            onEdit={handleEdit} 
            onDelete={handleDelete}
          />
        ) : (
          <ExpertSignupForm 
            mode="edit"
            onCancel={handleEditCancel}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default ProfileModal;

