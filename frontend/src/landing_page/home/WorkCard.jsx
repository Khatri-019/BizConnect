import "./WorkCard.css"

function WorkCard({ Icon, iconTextPara, cardTitle, cardPara, listitems }) {
  return (
    <div className="card work-card" >
      <div className="work-card-icon-div">
        {Icon}
        <span className="work-card-icon-text">{iconTextPara}</span>
      </div>

      <div className="card-body work-card-body ">
        <h5 className="card-title work-card-title">{cardTitle}</h5>
        <p className="card-text work-card-para">{cardPara}</p>
      </div>

      <ul className="work-card-list">
        <li >{listitems[0]}</li>
        <li >{listitems[1]}</li>
        <li >{listitems[2]}</li>
      </ul>
    </div>
  );
}

export default WorkCard;
