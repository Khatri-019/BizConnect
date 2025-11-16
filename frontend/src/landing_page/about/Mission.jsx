import "./Mission.css";
import MissionCard from "./MissionCard";

import FlagIcon from '@mui/icons-material/Flag';
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

function Mission() {
    return (
        <div className="container-fluid mission-container">
            {/* This part stays the same */}
            <div className="row mission-row-1">
                <FlagIcon
                    sx={{
                        fontSize: "8rem",
                        color: "#165bff",
                        backgroundColor: "#cdeaff",
                        padding: "1.8rem",
                        borderRadius: "4rem",
                    }}
                />
                <p>Our Mission</p>
                <h1>
                    Empowering Global Business Through <br /> Seamless Communication
                </h1>
                <p>
                    Building a future where language, distance, and technology barriers to <br /> 
                    international business communication disappear.
                </p>
            </div>
            <div className="mission-cards-container">
                <MissionCard
                    Icon={
                        <LanguageOutlinedIcon
                            sx={{
                                fontSize: "3.8rem",
                                color: "#165bff",
                                backgroundColor: "#cdeaff",
                                padding: "0.6rem",
                                borderRadius: "2rem",
                            }}
                        />
                    }
                    cardTitle={"Global Connection"}
                    cardPara={
                        "Breaking down barriers to enable seamless worldwide collaboration."
                    }
                />
                <MissionCard
                    Icon={
                        <FavoriteBorderOutlinedIcon
                            sx={{
                                fontSize: "3.8rem",
                                color: "#165bff",
                                backgroundColor: "#cdeaff",
                                padding: "0.6rem",
                                borderRadius: "2rem",
                            }}
                        />
                    }
                    cardTitle={"Human-Centered"}
                    cardPara={
                        "Technology should enhance human connection, not replace it."
                    }
                />
                <MissionCard
                    Icon={
                        <ShieldOutlinedIcon
                            sx={{
                                fontSize: "3.8rem",
                                color: "#165bff",
                                backgroundColor: "#cdeaff",
                                padding: "0.6rem",
                                borderRadius: "2rem",
                            }}
                        />
                    }
                    cardTitle={"Trust & Security"}
                    cardPara={
                        "Your business conversations and documents are always protected."
                    }
                />
                <MissionCard
                    Icon={
                        <LightbulbOutlinedIcon
                            sx={{
                                fontSize: "3.8rem",
                                color: "#165bff",
                                backgroundColor: "#cdeaff",
                                padding: "0.6rem",
                                borderRadius: "2rem",
                            }}
                        />
                    }
                    cardTitle={"Innovation"}
                    cardPara={
                        "Constantly pushing boundaries to solve real business challenges."
                    }
                />
            </div>
        </div>
    );
}

export default Mission;