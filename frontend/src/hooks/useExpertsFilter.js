import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { sortExperts } from "../utils/sortUtils.js";

/**
 * Hook for filtering and sorting experts
 */
export const useExpertsFilter = (experts, selectedIndustry, searchQuery, sortOption) => {
  const { user } = useAuth();

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

    // Sort experts
    return sortExperts(filtered, sortOption);
  }, [experts, user, selectedIndustry, searchQuery, sortOption]);

  return filteredAndSortedExperts;
};

