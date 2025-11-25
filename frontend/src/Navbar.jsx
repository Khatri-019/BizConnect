import React, { useState } from "react";
import DuoIcon from '@mui/icons-material/Duo';
import { useSignup } from "./context/SignupContext";
import { useAuth } from "./context/AuthContext"; // 1. Import AuthContext
import LoginModal from "./landing_page/login/LoginModal"; // 2. Import LoginModal
import "./Navbar.css"

function Navbar() {
  const { openSignup } = useSignup();
  const { user, logout } = useAuth(); // 3. Get user state & logout function
  const [isLoginOpen, setIsLoginOpen] = useState(false); // Local state for login modal

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand my-brand" href="/">
            <span className="me-2">
              <DuoIcon sx={{ fontSize: "4rem", marginRight:"0.4rem", color: "black" }} />
            </span>
            BizConnect
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              
              {/* 4. Logic: Hide Home if logged in */}
              {!user && (
                <li className="nav-item"><a className="nav-link my-link" href="/">Home</a></li>
              )}
              
              <li className="nav-item"><a className="nav-link my-link" href="/experts">Find Experts</a></li>
              <li className="nav-item"><a className="nav-link my-link" href="/about">About Us</a></li>
              <li className="nav-item"><a className="nav-link my-link" href="/support">Support</a></li>
            </ul>

            <div className="d-flex align-items-center right-links">
              {user ? (
                // 5. LOGGED IN VIEW
                <div className="d-flex align-items-center gap-3">
                  <span className="text-secondary fs-4" style={{marginRight: '1rem'}}>
                    Hi, {user.username}
                  </span>
                  <button 
                    className="btn btn-outline-danger" 
                    style={{fontSize: '1.4rem'}} 
                    onClick={logout}
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                // 6. LOGGED OUT VIEW
                <>
                  <button 
                    className="nav-link me-3 sign-in btn-link border-0 bg-transparent" 
                    onClick={() => setIsLoginOpen(true)}
                  >
                    Sign In
                  </button>
                  <button className="btn get-started" onClick={openSignup}>
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 7. Render Login Modal Component */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}

export default Navbar;