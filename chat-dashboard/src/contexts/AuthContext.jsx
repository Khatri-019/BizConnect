import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      } catch (error) {
        // Not logged in - redirect to frontend
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Use production URL in production, localhost in development
          // Similar to backend/app.js: if NODE_ENV=production use production links, else localhost
          const isProduction = import.meta.env.MODE === 'production';
          const frontendUrl = isProduction ? (import.meta.env.VITE_FRONTEND_URL) : "http://localhost:5173";
          window.location.href = frontendUrl;
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

