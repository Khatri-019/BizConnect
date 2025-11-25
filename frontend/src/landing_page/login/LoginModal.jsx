import React, { useState } from "react";
import axios from "axios";
import { LuX, LuLoader, LuLogIn } from "react-icons/lu";
import { useAuth } from "../../context/AuthContext";
import SignupCard from "../signup/SignupCard"; 
import Button from "../signup/Button";
import Input from "../signup/Input";
import Label from "../signup/Label";
import "../signup/SignupModal.css"; 
import "../signup/ExpertSignupForm.css"; 

// Simple prop to control visibility from Navbar
function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Call Login API (Cookies are set automatically by backend)
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      
      // 2. Update Context State
      login(res.data.user); 
      
      // 3. Close Modal
      onClose(); 
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-modal-overlay" onClick={onClose}>
      <div className="signup-modal-content" onClick={(e) => e.stopPropagation()} style={{width: 'fit-content'}}>
        <button className="close-modal-btn" onClick={onClose}>
          <LuX size={24} />
        </button>
        
        <SignupCard className="signup-card-step-1"> 
          <div className="signup-card-header">
            <h1 className="signup-card-title">Welcome Back</h1>
            <p className="signup-card-description">Sign in to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="expert-form" style={{padding: '0 1rem'}}>
            <div className="form-group">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={formData.username} onChange={handleChange} placeholder="Enter username" />
            </div>

            <div className="form-group">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter password" />
            </div>

            {error && <p className="error-message" style={{textAlign: 'center', fontSize: '1.2rem'}}>{error}</p>}

            <Button type="submit" disabled={loading} style={{marginTop: '1rem'}}>
              {loading ? <><LuLoader className="spinner" /> Signing In...</> : <><LuLogIn /> Sign In</>}
            </Button>
          </form>
        </SignupCard>
      </div>
    </div>
  );
}

export default LoginModal;