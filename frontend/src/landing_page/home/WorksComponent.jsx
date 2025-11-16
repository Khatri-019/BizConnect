import WorkCard from "./WorkCard";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import VideocamIcon from "@mui/icons-material/Videocam";
import "./WorksComponent.css"


function WorksComponent() {
    return (
        <div className="container-fluid works-card-container">
            <div className="row">
                <div className="col">
                    <WorkCard
                        Icon={
                            <PersonAddAltIcon
                                sx={{
                                    fontSize: "3.8rem",
                                    color: "#165bff",
                                    backgroundColor: "#cdeaff",
                                    padding: "0.6rem",
                                    borderRadius: "2rem",
                                }}
                            />
                        }
                        iconTextPara={"STEP 01"}
                        cardTitle={"Create Your Profile"}
                        cardPara={"Professionals register with their expertise and availability. Clients can browse and discover the perfect consultant for their needs."}
                        listitems={["Professional profiles", "Expertise showcase", "Availability calendar"]}
                    />
                </div>

                <div className="col">
                      <WorkCard
                        Icon={
                            <PersonAddAltIcon
                                sx={{
                                    fontSize: "3.8rem",
                                    color: "#165bff",
                                    backgroundColor: "#cdeaff",
                                    padding: "0.6rem",
                                    borderRadius: "2rem",
                                }}
                            />
                        }
                        iconTextPara={"STEP 02"}
                        cardTitle={"Book & Schedule"}
                        cardPara={"Simple booking system allows clients to schedule or request instant meetings with consultants worldwide."}
                        listitems={["Instant booking", "Flexible scheduling", "Time zone handling"]}
                    />
                </div>
                <div className="col">
                      <WorkCard
                        Icon={
                            <PersonAddAltIcon
                                sx={{
                                    fontSize: "3.8rem",
                                    color: "#165bff",
                                    backgroundColor: "#cdeaff",
                                    padding: "0.6rem",
                                    borderRadius: "2rem",
                                }}
                            />
                        }
                        iconTextPara={"STEP 03"}
                        cardTitle={"Connect & Collaborate"}
                        cardPara={"Join secure 1-1 video calls with real-time AI translation, document sharing, and seamless communication."}
                        listitems={["HD video quality", "AI translation", "Secure document sharing"]}
                    />
                </div>
            </div>
        </div>
    );
}

export default WorksComponent;
