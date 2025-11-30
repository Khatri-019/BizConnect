import React from "react";
import { useNavigate } from "react-router-dom";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import { useAuth } from "../../context/AuthContext";
import { chatAPI } from "../../services/api";
import "./ExpertCard.css";

function ExpertCard({expertId, img, name, industry, rating, experienceYears, location, description}) {
    const { user, openLogin } = useAuth();
    const navigate = useNavigate();

    const handleBookCall = async () => {
        // Check if user is logged in
        if (!user) {
            alert("Please login to book a call with an expert.");
            openLogin();
            return;
        }

        try {
            // Create or get conversation with expert
            const conversation = await chatAPI.createConversation(expertId);
            
            // Ensure conversation ID is available
            const convId = conversation._id || conversation.id;
            if (!convId) {
                throw new Error("Failed to get conversation ID");
            }
            
            // Small delay to ensure conversation is saved in database
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Redirect to chat-dashboard with conversation ID
            // Use production URL in production, localhost in development
            // Similar to backend/app.js: if NODE_ENV=production use production links, else localhost
            const isProduction = import.meta.env.MODE === 'production';
            const chatUrl = isProduction? (import.meta.env.VITE_CHAT_DASHBOARD_URL): "http://localhost:5174";
            window.location.href = `${chatUrl}?conversationId=${convId}`;
        } catch (error) {
            console.error("Error booking call:", error);
            const message = error.response?.data?.message || "Failed to book a call. Please try again.";
            alert(message);
        }
    };

    return (
        <div class="card expert-card">
            <div class="img-container">
                <img src={img} class="card-img-top" alt=".." />
            </div>
            <div class="card-body">
                <div class="card-title">
                    <span>{name} </span>
                    <span class="rating">
                        <span>
                                <StarRoundedIcon sx={{ color: "#ffc509" ,fontSize:"3rem" }} />
                        </span>
                        <span  style={{fontSize:"1.9rem" ,marginTop :"0.5rem"}} >{rating}</span>
                    </span>
                </div>

                <div class="card-subtitle1 mb-2 text-body-secondary ">
                    <span>{industry} </span>
                    <span>
                        <span>
                            <FiberManualRecordRoundedIcon style={{ fontSize: "0.8rem" ,marginRight:"0.5rem" }} />
                        </span>
                        <span>{experienceYears} + years</span>
                    </span>
                </div>
                <div class="card-subtitle2 mb-2 text-body-secondary ">
                    <span>
                        <LocationPinIcon sx={{ fontSize: "1.5rem"  ,marginRight:"0.5rem"}} />
                    </span>
                    <span>{location}</span>
                </div>

                <p class="card-text">
                    {description}
                </p>

                <button class="btn btn-dark secondary" onClick={handleBookCall}>
                    <span>
                        <CalendarTodayRoundedIcon sx={{ marginRight: "0.7rem" }} />
                    </span>
                    <span style={{fontSize:"1.4rem"}}>
                             Book a Call
                    </span>
                   
                </button>
            </div>
        </div>
    );
}

export default ExpertCard;
