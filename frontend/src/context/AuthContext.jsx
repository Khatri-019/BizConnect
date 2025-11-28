import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal states (merged from SignupContext)
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const navigate = useNavigate();

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      } catch (error) {
        // 401/403 means not logged in - this is expected, not an error
        if (error.response?.status !== 401 && error.response?.status !== 403) {
          console.error("Auth check failed:", error.message);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login - calls API and sets user
  const login = useCallback(async (credentials) => {
    const response = await authAPI.login(credentials);
    setUser(response.user);
    setIsLoginOpen(false);
    navigate("/experts");
    return response;
  }, [navigate]);

  // Set user directly (used after signup when cookies are already set)
  const setAuthUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  // Logout - calls API and clears user
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      navigate("/");
    }
  }, [navigate]);

  // Modal controls
  const openSignup = useCallback(() => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  }, []);

  const closeSignup = useCallback(() => {
    setIsSignupOpen(false);
  }, []);

  const openLogin = useCallback(() => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setIsLoginOpen(false);
  }, []);

  const value = {
    // Auth state
    user,
    loading,
    isAuthenticated: !!user,
    
    // Auth actions
    login,
    logout,
    setAuthUser,
    
    // Modal state & actions
    isSignupOpen,
    isLoginOpen,
    openSignup,
    closeSignup,
    openLogin,
    closeLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
