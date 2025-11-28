import React, { useState } from "react";
import DuoIcon from "@mui/icons-material/Duo";
import ChatIcon from "@mui/icons-material/Chat";
import { useAuth } from "./context/AuthContext";
import UserMenu from "./components/UserMenu";
import ProfileModal from "./components/ProfileModal";
import { expertsAPI, authAPI } from "./services/api";
import "./Navbar.css";

function Navbar() {
  const { user, logout, openSignup, openLogin, setAuthUser } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileView, setProfileView] = useState("profile"); // "profile" or "edit"

  const handleViewProfile = () => {
    setIsProfileModalOpen(true);
  };

  const handleEditProfile = () => {
    setProfileView("edit");
    setIsProfileModalOpen(true);
  };

  const handleDeleteProfile = async () => {
    if (!user || !user.id) return;
    
    if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      return;
    }

    try {
      await expertsAPI.deleteProfile(user.id);
      await logout();
      setIsProfileModalOpen(false);
    } catch (error) {
      console.error("Delete profile error:", error);
      alert("Failed to delete profile. Please try again.");
    }
  };

  const handleProfileUpdated = async () => {
    // Refresh user data if needed
    try {
      const userData = await authAPI.getCurrentUser();
      setAuthUser(userData);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand my-brand" href="/">
            <span className="me-2">
              <DuoIcon sx={{ fontSize: "4rem", marginRight: "0.4rem", color: "black" }} />
            </span>
            BizConnect
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              {/* Show Home only when not logged in */}
              {!user && (
                <li className="nav-item">
                  <a className="nav-link my-link" href="/">
                    Home
                  </a>
                </li>
              )}

              <li className="nav-item">
                <a className="nav-link my-link" href="/experts">
                  Find Experts
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link my-link" href="/about">
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link my-link" href="/support">
                  Support
                </a>
              </li>
            </ul>

            <div className="d-flex align-items-center right-links">
              {user ? (
                // LOGGED IN VIEW - Show UserMenu badge and Chat Dashboard link
                <>
                  <button
                    className="btn btn-outline-primary me-3"
                    style={{ fontSize: "1.4rem" }}
                    onClick={() => window.location.href = "http://localhost:5174"}
                    title="Go to Chat Dashboard"
                  >
                    <ChatIcon sx={{ marginRight: "0.5rem" }} />
                    Chat Dashboard
                  </button>
                  <UserMenu
                    onViewProfile={handleViewProfile}
                    onEditProfile={handleEditProfile}
                    onDeleteProfile={handleDeleteProfile}
                    onLogout={logout}
                  />
                </>
              ) : (
                // LOGGED OUT VIEW
                <>
                  <button
                    className="nav-link me-3 sign-in btn-link border-0 bg-transparent"
                    onClick={openLogin}
                  >
                    Sign In
                  </button>
                  <button 
                    className="btn get-started" 
                    onClick={openSignup}
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setProfileView("profile");
        }}
        initialView={profileView}
        onProfileUpdated={handleProfileUpdated}
        onProfileDeleted={handleDeleteProfile}
      />
    </>
  );
}

export default Navbar;
