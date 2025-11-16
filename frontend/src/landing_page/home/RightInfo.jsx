import "./RightInfo.css";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";

function RightInfo({ heading, para, listitems, img, Icon, iconTextPara }) {
    return (
        <div className="container-fluid right-container">
            <div className="row">
                <div className="col-6">
                    <img src={img} className="right-info-img" alt="" />
                </div>
                <div className="col-6 right-info-col">
                    <div className="icon-text">
                        {Icon}
                        <span className="icon-text-para">{iconTextPara}</span>
                    </div>

                    <h2>{heading}</h2>
                    <p className="right-info-para">{para}</p>
                    <div>
                        <ul className="right-info-ul">
                            <li>
                                <span className="list-icon">
                                    <TaskAltOutlinedIcon />
                                </span>
                                {listitems[0]}
                            </li>

                            <li>
                                <span className="list-icon">
                                    <TaskAltOutlinedIcon />
                                </span>
                                {listitems[1]}
                            </li>

                            <li>
                                <span className="list-icon">
                                    <TaskAltOutlinedIcon />
                                </span>
                                {listitems[2]}
                            </li>
                        </ul>

                        {/* <button
                            className="btn btn-dark mr-3 get-started-btn"
                            style={{ fontSize: "1rem", borderRadius: "15px" }}
                        >
                            <span>Learn More </span>
                            <span className="arrow-icon">
                                <ArrowForwardOutlinedIcon fontSize="medium" />
                            </span>
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RightInfo;
