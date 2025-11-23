import React from "react";
import "./SignupCard.css";

function SignupCard({ children, className = "" }) {
  return (
    <div className={`singup-card ${className}`}>
      {children}
    </div>
  );
}

export default SignupCard;
    