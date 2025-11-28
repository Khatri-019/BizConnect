import React, { useEffect, useState } from "react";
import { LuX } from "react-icons/lu";
import { useAuth } from "../../context/AuthContext";
import SignupCredentials from "./SignupCredentials";
import ExpertSignupForm from "./ExpertSignupForm";
import "./SignupModal.css";

function SignupModal() {
  const { isSignupOpen, closeSignup } = useAuth();
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isSignupOpen) {
      // Delay reset to allow closing animation
      const timer = setTimeout(() => {
        setStep(1);
        setCredentials(null);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSignupOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isSignupOpen) {
        closeSignup();
      }
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSignupOpen, closeSignup]);

  if (!isSignupOpen) return null;

  // Step 1 -> Step 2: Save credentials and advance
  const handleNextStep = (data) => {
    setCredentials(data);
    setStep(2);
  };

  // Step 2 -> Step 1: Go back
  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="signup-modal-overlay" onClick={closeSignup}>
      <div
        className="signup-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="close-modal-btn" 
          onClick={closeSignup}
          aria-label="Close signup modal"
        >
          <LuX size={24} />
        </button>

        {/* Step indicator */}
        <div className="step-indicator" style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "0.5rem", 
          marginBottom: "1rem" 
        }}>
          <span style={{ 
            width: "2rem", 
            height: "4px", 
            borderRadius: "2px",
            background: step >= 1 ? "#3b82f6" : "#e5e7eb" 
          }} />
          <span style={{ 
            width: "2rem", 
            height: "4px", 
            borderRadius: "2px",
            background: step >= 2 ? "#3b82f6" : "#e5e7eb" 
          }} />
        </div>

        {step === 1 ? (
          <SignupCredentials onNext={handleNextStep} />
        ) : (
          <ExpertSignupForm 
            credentials={credentials} 
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}

export default SignupModal;
