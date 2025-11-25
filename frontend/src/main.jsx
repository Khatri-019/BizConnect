import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignupProvider } from "./context/SignupContext";
import { AuthProvider } from "./context/AuthContext"; // 1. Import AuthProvider

import Navbar from "./Navbar";
import HomePage from "./landing_page/home/HomePage";
import ExpertsPage from "./landing_page/experts/ExpertsPage";
import AboutPage from "./landing_page/about/AboutPage";
import SupportPage from "./landing_page/support/SupportPage";
import SignupModal from "./landing_page/signup/SignupModal";
import LoginModal from "./landing_page/login/LoginModal"; // We will create this next
import Footer from "./Footer";

import "./utils/axiosConfig";

// Configure axios to always send cookies
import axios from "axios";
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SignupProvider>
      <BrowserRouter>
        {/* 2. Wrap App in AuthProvider */}
        <AuthProvider>
          <Navbar />
          <SignupModal />
          <LoginModal /> 
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/experts" element={<ExpertsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/support" element={<SupportPage />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </SignupProvider>
  </StrictMode>
);