import React, { useState, useEffect } from "react";
import "./Hero.css";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { UNIQUE_INDUSTRIES } from "../../utils/industries";

function Hero({ selectedIndustry, onIndustryChange, searchQuery, onSearchChange, sortOption, onSortChange }) {
    // Add "All Categories" at the beginning of the industries list
    const categories = ["All Categories", ...UNIQUE_INDUSTRIES];
    const [localSelectedCategory, setLocalSelectedCategory] = useState(selectedIndustry || "All Categories");

    const ratings = ["Highest Rated", "Most Relevant", "Newest"];
    const [localSelectedRating, setLocalSelectedRating] = useState(sortOption || "Highest Rated");

    // Sync with parent component
    useEffect(() => {
        if (selectedIndustry) {
            setLocalSelectedCategory(selectedIndustry);
        }
    }, [selectedIndustry]);

    useEffect(() => {
        if (sortOption) {
            setLocalSelectedRating(sortOption);
        }
    }, [sortOption]);

    const handleCategorySelect = (category) => {
        setLocalSelectedCategory(category);
        if (onIndustryChange) {
            onIndustryChange(category);
        }
    };

    const handleRatingSelect = (rating) => {
        setLocalSelectedRating(rating);
        if (onSortChange) {
            onSortChange(rating);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        if (onSearchChange) {
            onSearchChange(value);
        }
    };


    return (
        <div className="container-fluid experts-hero-container">
            <div className="row experts-hero-row justify-content-center text-center">
                <div className="col-12 col-lg-10 col-xl-8">
                    <h1>Book a Call with Experts</h1>
                    <p className="mb-4">Connect with top professionals worldwide</p>

                    <div className="search-container d-flex align-items-center">

                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name, expertise, or skills..."
                                aria-label="Search for an expert"
                                value={searchQuery || ""}
                                onChange={handleSearchChange}
                            />
                        </div>

                        <div className="dropdown">
                            <button
                                className="btn dropdown-toggle custom-dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                title={localSelectedCategory}
                            >
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {localSelectedCategory}
                                </span>
                            </button>
                            <ul className="dropdown-menu">
                                {categories.map((category) => (
                                    <li key={category}>
                                        <button
                                            className="dropdown-item"
                                            type="button"
                                            onClick={() => handleCategorySelect(category)}
                                        >
                                            <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {category}
                                            </span>
                                            {/* Conditionally render the checkmark */}
                                            {localSelectedCategory === category && (
                                                <CheckOutlinedIcon sx={{ color: "green", flexShrink: 0, marginLeft: "0.5rem" }} />
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="dropdown">
                            <button
                                className="btn dropdown-toggle custom-dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {localSelectedRating}
                            </button>
                            <ul className="dropdown-menu">
                                {ratings.map((rating) => (
                                    <li key={rating}>
                                        <button
                                            className="dropdown-item"
                                            type="button"
                                            onClick={() => handleRatingSelect(rating)}
                                        >
                                            <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {rating}
                                            </span>
                                            {localSelectedRating === rating && (
                                                <CheckOutlinedIcon sx={{ color: "green", flexShrink: 0, marginLeft: "0.5rem" }} />
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;