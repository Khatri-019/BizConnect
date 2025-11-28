import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./UserMenu.css";

function UserMenu({ onViewProfile, onEditProfile, onDeleteProfile, onLogout }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (action) => {
    setIsOpen(false);
    if (action === "view") onViewProfile();
    else if (action === "edit") onEditProfile();
    else if (action === "delete") onDeleteProfile();
    else if (action === "logout") onLogout();
  };

  if (!user) return null;

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button className="user-menu-badge" onClick={handleMenuClick}>
        <AccountCircleIcon sx={{ fontSize: "3.5rem", color: "#3b82f6" }} />
      </button>
      
      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <span className="user-menu-username">Hi, {user.username}</span>
          </div>
          <div className="user-menu-divider"></div>
          <button 
            className="user-menu-item"
            onClick={() => handleMenuItemClick("view")}
          >
            View Profile
          </button>
          <button 
            className="user-menu-item"
            onClick={() => handleMenuItemClick("edit")}
          >
            Edit Profile
          </button>
          <button 
            className="user-menu-item danger"
            onClick={() => handleMenuItemClick("delete")}
          >
            Delete Profile
          </button>
          <div className="user-menu-divider"></div>
          <button 
            className="user-menu-item"
            onClick={() => handleMenuItemClick("logout")}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;

