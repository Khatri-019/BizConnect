import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpertCard from "./ExpertCard";
import "./Cards.css";

function Cards() {
  const [experts, setExperts] = useState([]);        // store data
  const [loading, setLoading] = useState(true);      // track loading state
  const [error, setError] = useState(null);          // track error

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/experts");
        setExperts(res.data);                        // update state
      } catch (err) {
        setError("Failed to fetch experts.");
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []); // run once after mount

  if (loading) return <p>Loading experts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container-fluid card-container">
      {experts.map((el, idx) => (
        <ExpertCard
          key={idx}
          img={el.img}                     // Cloudinary image URL from MongoDB
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
