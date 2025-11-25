import React from "react";
import "./SignupCard.css";

function SignupCard({ children, className = "" }) {
  return (
    <div className={`signup-card ${className}`}>
      {children}
    </div>
  );
}

export default SignupCard;
    