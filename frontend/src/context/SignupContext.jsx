import React, { createContext, useState, useContext } from "react";

const SignupContext = createContext();

export const useSignup = () => useContext(SignupContext);

export const SignupProvider = ({ children }) => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openSignup = () => setIsSignupOpen(true);
  const closeSignup = () => setIsSignupOpen(false);

  return (
    <SignupContext.Provider value={{ isSignupOpen, openSignup, closeSignup }}>
      {children}
    </SignupContext.Provider>
  );
};