import React from "react";
import ExpertCard from "./ExpertCard";
import { useExperts } from "../../hooks/useExperts";
import { useExpertsFilter } from "../../hooks/useExpertsFilter";
import "./Cards.css";

function Cards({ selectedIndustry = "All Categories", searchQuery = "", sortOption = "Highest Rated" }) {
  const { experts, loading, error } = useExperts();
  const filteredAndSortedExperts = useExpertsFilter(experts, selectedIndustry, searchQuery, sortOption);

  if (loading) return <p>Loading experts...</p>;
  if (error) return <p>{error}</p>;

  if (filteredAndSortedExperts.length === 0) {
    return (
      <div className="container-fluid card-container">
        <p style={{ textAlign: "center", fontSize: "1.6rem", padding: "2rem" }}>
          No experts found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="container-fluid card-container">
      {filteredAndSortedExperts.map((el, idx) => (
        <ExpertCard
          key={el._id || el.id || `expert-${idx}`}
          expertId={el._id || el.id}
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
