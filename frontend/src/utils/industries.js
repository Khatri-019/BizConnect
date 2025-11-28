import data from "../data/data.js";

// Extract unique industries from data.js
export const getUniqueIndustries = () => {
  const industries = data
    .map(item => item.industry)
    .filter(industry => industry && industry.trim() !== "");
  
  const uniqueIndustries = [...new Set(industries)];
  return uniqueIndustries.sort(); // Sort alphabetically
};

// Export the unique industries as a constant
export const UNIQUE_INDUSTRIES = getUniqueIndustries();

