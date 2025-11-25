import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in (via cookie) on initial load
  useEffect(() => {
    const checkUser = async () => {
      try {
        // We hit the /me endpoint to see if the HTTP-only cookie is valid
        const res = await axios.get("http://localhost:5000/api/auth/me",{withCredentials:true});
        setUser(res.data);
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setUser(null);
        } else {
          // Only log real errors (like 500 Server Error)
          console.error("Auth check failed:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    navigate("/experts"); // Navigate to Find Experts after login
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout",{withCredentials:true});
      setUser(null);
      navigate("/"); // Navigate to Home after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};