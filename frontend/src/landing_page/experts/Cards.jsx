import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ExpertCard from "./ExpertCard";
import { useAuth } from "../../context/AuthContext";
import "./Cards.css";

function Cards({ selectedIndustry = "All Categories", searchQuery = "", sortOption = "Highest Rated" }) {
  const { user } = useAuth();
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

  // Filter and sort experts based on industry, search query, sort option, and logged-in user
  const filteredAndSortedExperts = useMemo(() => {
    let filtered = [...experts];

    // Filter out the logged-in expert's card
    if (user && user.role === "expert") {
      filtered = filtered.filter(expert => expert._id !== user.id);
    }

    // Filter by industry
    if (selectedIndustry && selectedIndustry !== "All Categories") {
      filtered = filtered.filter(expert => expert.industry === selectedIndustry);
    }

    // Filter by search query
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(expert => {
        const name = (expert.name || "").toLowerCase();
        const industry = (expert.industry || "").toLowerCase();
        const description = (expert.description || "").toLowerCase();
        const location = (expert.location || "").toLowerCase();
        
        return name.includes(query) || 
               industry.includes(query) || 
               description.includes(query) ||
               location.includes(query);
      });
    }

    // Sort experts based on sort option
    let sorted = [...filtered];
    switch (sortOption) {
      case "Highest Rated":
        sorted.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA; // Descending order
        });
        break;
      
      case "Newest":
        sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA; // Most recent first
        });
        break;
      
      case "Most Relevant":
        // Most relevant: combination of rating and recency
        // Higher rating gets priority, but newer experts with similar ratings rank higher
        sorted.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          
          // If ratings are close (within 0.5), prioritize newer
          if (Math.abs(ratingA - ratingB) < 0.5) {
            return dateB - dateA;
          }
          // Otherwise, prioritize higher rating
          return ratingB - ratingA;
        });
        break;
      
      default:
        // Default to highest rated
        sorted.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
        });
    }

    return sorted;
  }, [experts, user, selectedIndustry, searchQuery, sortOption]);

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
