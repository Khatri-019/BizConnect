import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";
import Navbar from "./Navbar";
import HomePage from "./landing_page/home/HomePage";
import ExpertsPage from "./landing_page/experts/ExpertsPage";
import AboutPage from "./landing_page/about/AboutPage";
import SupportPage from "./landing_page/support/SupportPage";
import SignupModal from "./landing_page/signup/SignupModal";
import LoginModal from "./landing_page/login/LoginModal";
import Footer from "./Footer";
import PageTransition from "./components/PageTransition";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <SignupModal />
        <LoginModal />
        <PageTransition>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/experts" element={<ExpertsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/support" element={<SupportPage />} />
          </Routes>
        </PageTransition>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
