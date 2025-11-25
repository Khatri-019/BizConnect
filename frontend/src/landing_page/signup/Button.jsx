import React from "react";
import "./Button.css";

const Button = React.forwardRef(({ 
  children, 
  className = "", 
  variant = "default",
  disabled = false,
  type = "button",
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      className={`signup-btn btn-${variant} ${className} ${disabled ? 'btn-disabled' : ''}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
