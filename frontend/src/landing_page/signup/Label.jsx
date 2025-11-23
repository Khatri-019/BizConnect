import React from "react";
import "./Label.css";

const Label = React.forwardRef(({ 
  children, 
  className = "", 
  htmlFor,
  ...props 
}, ref) => {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={`label ${className}`}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = "Label";

export default Label;
