import React from "react";
import DuoIcon from "@mui/icons-material/Duo";
import { useAuth } from "./context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout, openSignup, openLogin } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container-fluid">
        <a className="navbar-brand my-brand" href="/">
          <span className="me-2">
            <DuoIcon sx={{ fontSize: "4rem", marginRight: "0.4rem", color: "black" }} />
          </span>
          BizConnect
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            {/* Show Home only when not logged in */}
            {!user && (
              <li className="nav-item">
                <a className="nav-link my-link" href="/">
                  Home
                </a>
              </li>
            )}

            <li className="nav-item">
              <a className="nav-link my-link" href="/experts">
                Find Experts
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link my-link" href="/about">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link my-link" href="/support">
                Support
              </a>
            </li>
          </ul>

          <div className="d-flex align-items-center right-links">
            {user ? (
              // LOGGED IN VIEW
              <div className="d-flex align-items-center gap-3">
                <span 
                  className="text-secondary fs-4" 
                  style={{ marginRight: "1rem" }}
                >
                  Hi, {user.username}
                </span>
                <button
                  className="btn btn-outline-danger"
                  style={{ fontSize: "1.4rem" }}
                  onClick={logout}
                >
                  Log Out
                </button>
              </div>
            ) : (
              // LOGGED OUT VIEW
              <>
                <button
                  className="nav-link me-3 sign-in btn-link border-0 bg-transparent"
                  onClick={openLogin}
                >
                  Sign In
                </button>
                <button 
                  className="btn get-started" 
                  onClick={openSignup}
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
