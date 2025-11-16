import RightInfo from "./RightInfo";
import LeftInfo from "./LeftInfo";
import Divider from "./Divider";
import HeadingPara from "./HeadingPara";
import ExpDiffernce from "./ExpDifference";
import WorksComponent from "./WorksComponent";

import LanguageIcon from "@mui/icons-material/Language";
import SecurityIcon from "@mui/icons-material/Security";
import VideocamIcon from "@mui/icons-material/Videocam";
import "./InfoContainer.css";

function InfoContainer() {
    return (
        <section className="info-container">
            <HeadingPara
                heading={"Why Choose BizConnect Over Traditional Solutions?"}
                para={
                    <>
                        Built specifically for business professionals who need more than
                        basic video calls. Get <br /> advanced features that actually matter
                        for closing deals and building relationships.
                    </>
                }
            />
            <RightInfo
                heading={"AI powered global translation"}
                para={
                    "Break language barriers with real-time AI translation that supports 40+ languages. Communicate seamlessly with clients worldwide without missing crucial business details."
                }
                listitems={[
                    "Real-time voice & text translation",
                    "Industry-specific terminology",
                    "Cultural context awareness",
                ]}
                img={"media/images/translation.png"}
                Icon={
                    <LanguageIcon
                        sx={{
                            fontSize: "3.8rem",
                            color: "#165bff",
                            backgroundColor: "#cdeaff",
                            padding: "0.6rem",
                            borderRadius: "1rem",
                        }}
                    />
                }
                iconTextPara={"40+ Languages"}
            />
            <Divider />
            <LeftInfo
                heading={"Secure Document Sharing & Contracts"}
                para={
                    "Share sensitive business documents, contracts, and proposals with bank-level security. Built-in e-signature functionality streamlines deal closure without switching platforms."
                }
                listitems={[
                    "End-to-end encryption",
                    "Built-in e-signatures",
                    "Audit trail tracking",
                ]}
                img={"media/images/realistic_image_show.png"}
                Icon={
                    <SecurityIcon
                        sx={{
                            fontSize: "3.8rem",
                            color: "#165bff",
                            backgroundColor: "#cdeaff",
                            padding: "0.6rem",
                            borderRadius: "1rem",
                        }}
                    />
                }
                iconTextPara={"Bank level security"}
            />
            <Divider />
            <RightInfo
                heading={"1-on-1 Focused Video Calls"}
                para={
                    "Unlike Zoom or Teams designed for large meetings, BizConnect is optimized for personal business consultations. Crystal-clear HD video with intelligent background noise cancellation."
                }
                listitems={[
                    "HD video quality",
                    "Smart noise cancellation",
                    "Instant screen sharing",
                ]}
                img={"media/images/video_chat2.png"}
                Icon={
                    <VideocamIcon
                        sx={{
                            fontSize: "3.8rem",
                            color: "#165bff",
                            backgroundColor: "#cdeaff",
                            padding: "0.6rem",
                            borderRadius: "1rem",
                        }}
                    />
                }
                iconTextPara={"1-on-1 Optimized"}
            />
            <ExpDiffernce />
            <HeadingPara
                heading={"How BizConnect Works"}
                para={
                    <>
                        Three simple steps to connect with global business professionals and{" "}
                        <br />
                        break down communication barriers
                    </>
                }
            />
            <WorksComponent />
        </section>
    );
}

export default InfoContainer;
