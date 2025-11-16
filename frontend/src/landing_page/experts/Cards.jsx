import data from "D:/Major Projects/BizConncect/frontend/src/data/data.js";
import ExpertCard from "./ExpertCard";
import "./Cards.css"
function Cards() {
  return (
    <div className="container-fluid card-container">
      {data.map((el,idx) => (
        <ExpertCard
          key={idx}
          img={el.img}
          name={el.name}
          rating={el.rating}
          industry={el.industry}
          experienceYears={el.experienceYears}
          location={el.location}
          description={el.description}
        />
      ))}
    </div>
  );
}

export default Cards;
