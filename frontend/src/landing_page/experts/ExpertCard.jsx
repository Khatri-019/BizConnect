import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import "./ExpertCard.css";

function ExpertCard({img,name,industry,rating,experienceYears,location,description}) {
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

                <button class="btn btn-dark secondary ">
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
