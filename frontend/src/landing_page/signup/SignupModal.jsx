import React, { useEffect, useState } from "react";
import { LuX } from "react-icons/lu";
import { useSignup } from "../../context/SignupContext";
import SignupCredentials from "./SignupCredentials";
import ExpertSignupForm from "./ExpertSignupForm";
import "./SignupModal.css";

function SignupModal() {
  const { isSignupOpen, closeSignup } = useSignup();
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState(null); // <--- ADDED STATE

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isSignupOpen) {
      setTimeout(() => {
        setStep(1);
        setCredentials(null); // <--- RESET CREDENTIALS
      }, 300);
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isSignupOpen]);

  if (!isSignupOpen) return null;

  // Modified to save the credentials and move to step 2
  const handleNextStep = (data) => {
    setCredentials(data); // <--- SAVE CREDENTIALS OBJECT
    setStep(2);
  };

  return (
    <div className="signup-modal-overlay" onClick={closeSignup}>
      <div 
        className="signup-modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-modal-btn" onClick={closeSignup}>
          <LuX size={24} />
        </button>
        
        {step === 1 ? (
          // Pass handleNextStep (passes data forward)
          <SignupCredentials onNext={handleNextStep} /> 
        ) : (
          // Pass credentials down to Step 2
          <ExpertSignupForm credentials={credentials} /> 
        )}
      </div>
    </div>
  );
}

export default SignupModal;