/**
 * Sort experts by rating (highest first)
 */
export const sortByHighestRated = (experts) => {
  return [...experts].sort((a, b) => {
    const ratingA = a.rating || 0;
    const ratingB = b.rating || 0;
    return ratingB - ratingA; // Descending order
  });
};

/**
 * Sort experts by newest first
 */
export const sortByNewest = (experts) => {
  return [...experts].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
    return dateB - dateA; // Most recent first
  });
};

/**
 * Sort experts by most relevant (combination of rating and recency)
 * Higher rating gets priority, but newer experts with similar ratings rank higher
 */
export const sortByMostRelevant = (experts) => {
  return [...experts].sort((a, b) => {
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
};

/**
 * Sort experts based on sort option
 */
export const sortExperts = (experts, sortOption) => {
  switch (sortOption) {
    case "Highest Rated":
      return sortByHighestRated(experts);
    case "Newest":
      return sortByNewest(experts);
    case "Most Relevant":
      return sortByMostRelevant(experts);
    default:
      return sortByHighestRated(experts);
  }
};

