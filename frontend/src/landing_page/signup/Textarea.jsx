import React from "react";
import "./Textarea.css";

const Textarea = React.forwardRef(({ 
  className = "", 
  rows = 3,
  ...props 
}, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`textarea ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;
