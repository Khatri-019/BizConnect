import React from "react";
import "./ExpDifference.css"
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import { useAuth } from "../../context/AuthContext";

function ExpDiffernce() {
    const { openSignup } = useAuth();

    return (
        <div className="container-fluid exp-diff-container">
            <div className="row exp-diff-row ">
                <div className="my-col">
                    <h3>Ready to Experience the Difference?</h3>
                    <p>
                        Join thousands of business professionals who've made the switch to BizConnect
                    </p>
                    <div className="exp-diff-buttons">
                        {/* 3. Update Get Started button */}
                        <button
                            className="btn btn-dark mr-3 get-started-btn"
                            style={{ fontSize: "1.5rem", borderRadius: "15px" }}
                            onClick={openSignup}
                        >
                            <span>Get Started </span>
                            <span className="arrow-icon">
                                <ArrowForwardOutlinedIcon fontSize="larger" />
                            </span>
                        </button>
                        
                        <button
                            className="btn btn-light mr-3"
                            style={{ fontSize: "1.4rem", borderRadius: "15px", borderColor: "#494F55" }}
                        >
                            <span className="video-icon">
                                <PlayCircleOutlinedIcon sx={{ fontSize: "2.5rem", marginRight: "0.4rem" }} />
                            </span>
                            <span>Watch Demo</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ExpDiffernce;