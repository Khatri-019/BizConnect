import React, { useState } from "react";
import Hero from "./Hero";
import Cards from "./Cards";

function ExpertPage() {
  const [selectedIndustry, setSelectedIndustry] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Highest Rated");

  return (
    <>
      <Hero 
        selectedIndustry={selectedIndustry}
        onIndustryChange={setSelectedIndustry}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      <Cards 
        selectedIndustry={selectedIndustry}
        searchQuery={searchQuery}
        sortOption={sortOption}
      />
    </>
  );
}

export default ExpertPage;
