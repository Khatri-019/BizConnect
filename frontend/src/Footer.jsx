import React from "react";
import "./Footer.css";
import { FaFacebookF, FaTwitter, FaPinterest, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import VideocamIcon from "@mui/icons-material/Videocam";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="container-fluid px-5"> {/* Added px-5 for padding */}
        <div className="row footer-top-row">
          <div className="col-lg-3 col-md-6 footer-col">
            <div className="logo-container">
              <VideocamIcon
                sx={{
                  fontSize: "3.8rem",
                  color: "#fff",
                  backgroundColor: "#165bff",
                  padding: "0.6rem",
                  borderRadius: "1rem",
                }}
              />
              <h5 className="logo-text">BizConnect</h5>
            </div>
            <p className="footer-description">
              AI-powered 1-1 video consulting platform connecting global business
              professionals with seamless communication.
            </p>
            <div className="social-icons">
              <a href="#!"><FaFacebookF /></a>
              <a href="#!"><FaTwitter /></a>
              <a href="#!"><FaPinterest /></a>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 footer-col">
            <h5>Product</h5>
            <ul className="list-unstyled">
              <li><a href="#!">Features</a></li>
              <li><a href="#!">Pricing</a></li>
              <li><a href="#!">API</a></li>
              <li><a href="#!">Documentation</a></li>
              <li><a href="#!">Integrations</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 footer-col">
            <h5>Company</h5>
            <ul className="list-unstyled">
              <li><a href="#!">About Us</a></li>
              <li><a href="#!">Careers</a></li>
              <li><a href="#!">Press</a></li>
              <li><a href="#!">Privacy Policy</a></li>
              <li><a href="#!">Terms of Service</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 footer-col">
            <h5>Contact</h5>
            <ul className="list-unstyled contact-list">
              <li>
                <FaEnvelope className="contact-icon" />
                <a href="mailto:hello@bizconnect.com">hello@bizconnect.com</a>
              </li>
              <li>
                <FaPhoneAlt className="contact-icon" />
                <a href="tel:+15551234567">+1 (555) 123-4567</a>
              </li>
              <li>
                <FaMapMarkerAlt className="contact-icon" />
                <div>123 Business Ave<br />San Francisco, CA 94105</div>
              </li>
            </ul>
          </div>
        </div>

        <div className="row footer-bottom-row">
          <div className="col-md-6">
            <p className="copyright-text">© 2024 BizConnect. All rights reserved.</p>
          </div>
          <div className="col-md-6 footer-bottom-links">
            <a href="#!">Privacy</a>
            <a href="#!">Terms</a>
            <a href="#!">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;