import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import HomePage from "./landing_page/home/HomePage";
import ExpertsPage from "./landing_page/experts/ExpertsPage";
import AboutPage from "./landing_page/about/AboutPage";
import SupportPage from "./landing_page/support/SupportPage";
import ExpertSignupForm from "./landing_page/signup/ExpertSignupForm";

import Footer from "./Footer";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <BrowserRouter>
        <Navbar />
        {/* <ExpertSignupForm /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/experts" element={<ExpertsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/support" element={<SupportPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  </StrictMode>
);
