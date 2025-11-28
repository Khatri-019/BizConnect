import React, { useState, useEffect } from "react";
import { LuX, LuLoader, LuLogIn, LuUser, LuLock } from "react-icons/lu";
import { useAuth } from "../../context/AuthContext";
import SignupCard from "../signup/SignupCard"; 
import { Button, Input, Label } from "../../form_ui";
import "../signup/SignupModal.css";
import "../signup/ExpertSignupForm.css";

function LoginModal() {
  const { isLoginOpen, closeLogin, login, openSignup } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal closes
  useEffect(() => {
    if (!isLoginOpen) {
      setFormData({ username: "", password: "" });
      setError("");
    } else {
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoginOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isLoginOpen) {
        closeLogin();
      }
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isLoginOpen, closeLogin]);

  if (!isLoginOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData);
      // login() handles closing modal and navigation
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchToSignup = () => {
    closeLogin();
    openSignup();
  };

  return (
    <div className="signup-modal-overlay" onClick={closeLogin}>
      <div 
        className="signup-modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ width: "fit-content" }}
      >
        <button 
          className="close-modal-btn" 
          onClick={closeLogin}
          aria-label="Close login modal"
        >
          <LuX size={24} />
        </button>

        <SignupCard className="signup-card-step-1">
          <div className="signup-card-header">
            <h1 className="signup-card-title">Welcome Back</h1>
            <p className="signup-card-description">
              Sign in to access your account
            </p>
          </div>

          <form 
            onSubmit={handleSubmit} 
            className="expert-form" 
            style={{ padding: "0 1rem" }}
          >
            <div className="form-group">
              <Label htmlFor="username">
                <LuUser className="label-icon" />
                Username
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <Label htmlFor="password">
                <LuLock className="label-icon" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p 
                className="error-message" 
                style={{ textAlign: "center", fontSize: "1.2rem" }}
              >
                {error}
              </p>
            )}

            <Button 
              type="submit" 
              disabled={loading} 
              style={{ marginTop: "1rem" }}
            >
              {loading ? (
                <>
                  <LuLoader className="spinner" /> Signing In...
                </>
              ) : (
                <>
                  <LuLogIn /> Sign In
                </>
              )}
            </Button>

            <p style={{ 
              textAlign: "center", 
              marginTop: "1rem", 
              fontSize: "1.1rem",
              color: "#6b7280" 
            }}>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={switchToSignup}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  cursor: "pointer",
                  fontSize: "inherit",
                  textDecoration: "underline",
                }}
              >
                Sign up
              </button>
            </p>
          </form>
        </SignupCard>
      </div>
    </div>
  );
}

export default LoginModal;
