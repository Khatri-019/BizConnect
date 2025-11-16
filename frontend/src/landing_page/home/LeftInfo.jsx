import "./LeftInfo.css"
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";

function LeftInfo({heading,para,listitems,img ,Icon ,iconTextPara}) {
    return (
        <div className="container-fluid left-container">
            <div className="row">
                <div className="col-6 left-info-col">
        
                    <div className="icon-text">
                        {Icon}
                         <span className="icon-text-para">
                            {iconTextPara}
                         </span>
                    </div>

                    <h2> {heading}</h2>
                    <p className="left-info-para">
                       {para}
                    </p>
                    <div>
                        <ul className="left-info-ul">
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
                    </div>
                </div>
                <div className="col-6">
                    <img
                        src={img}
                        className="left-info-img"
                        alt=""
                    />
                </div>
            </div>
        </div>
    );
}

export default LeftInfo;
