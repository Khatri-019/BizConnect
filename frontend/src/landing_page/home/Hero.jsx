import React from "react";
import "./Hero.css";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import { useAuth } from "../../context/AuthContext";

function Hero() {
    const { openSignup } = useAuth();

    return (
        <div className="container-fluid my-container">
            <div className="row">
                <div className="col">
                    <h1 className="hero-heading">
                        Connect Globally with <br />
                        <span className="smart-word">Smart 1-1  &nbsp;</span>
                         Video Consulting <br />& Business Deals
                    </h1>
                    <p className="hero-para">
                        Bridge language barriers and streamline business <br /> connections
                        with API-powered translation, secure document sharing, <br /> and
                        seamless chat communication.
                    </p>

                    <div className="hero-buttons">
                        {/* 3. Update Get Started button */}
                        <button
                            className="btn btn-dark mr-3 get-started-btn"
                            style={{ fontSize: "2rem", borderRadius: "15px" }}
                            onClick={openSignup} 
                        >
                            <span>Get Started </span>
                            <span className="arrow-icon">
                                <ArrowForwardOutlinedIcon fontSize="larger" />
                            </span>
                        </button>

                        <button
                            className="btn btn-light mr-3"
                            style={{ fontSize: "2rem", borderRadius: "15px", borderColor: "#494F55"}}
                        >   
                            <span className="video-icon">
                                <PlayCircleOutlinedIcon sx={{ fontSize: "2.5rem", marginRight:"0.4rem"}} />
                            </span>
                            <span>Watch Demo</span> 
                        </button>
                    </div>
                </div>
                <div className="col">
                    <img src="media/images/video_chat.jpeg" className="video-chat" alt="Video Chat" />
                </div>
            </div>
        </div>
    );
}

export default Hero;