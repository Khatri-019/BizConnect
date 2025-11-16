import "./MissionCard.css"

function MissionCard({Icon,cardTitle,cardPara}) {
    return (
        <div className="card mission-card">
            <div className="mission-card-icon-div">
                {Icon}
            </div>

            <div className="card-body mission-card-body ">
                <h5 className="card-title mission-card-title">{cardTitle}</h5>
                <p className="card-text mission-card-para">{cardPara}</p>
            </div>
        </div>
    );
}

export default MissionCard;
