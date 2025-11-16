import React, { useState } from "react"; // 👈 Import useState
import "./Hero.css";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';



function Hero() {
    const categories = ["All Categories", "Business Strategy", "Technology", "Marketing", "Finance"];
    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    const ratings = ["Highest Rated", "Most Relevant", "Newest"];
    const [selectedRating, setSelectedRating] = useState("Highest Rated");

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleRatingSelect = (rating) => {
        setSelectedRating(rating);
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
                            />
                        </div>

                        <div className="dropdown">
                            <button
                                className="btn dropdown-toggle custom-dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {selectedCategory}
                            </button>
                            <ul className="dropdown-menu">
                                {categories.map((category) => (
                                    <li key={category}>
                                        <button
                                            className="dropdown-item"
                                            type="button"
                                            onClick={() => handleCategorySelect(category)}
                                        >
                                            {category}
                                            {/* Conditionally render the checkmark */}
                                            {selectedCategory === category && <CheckOutlinedIcon sx={{color:"green"}} />}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="dropdown">
                            <button
                                className="btn dropdown-toggle   custom-dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {selectedRating}
                            </button>
                            <ul className="dropdown-menu">
                                {ratings.map((rating) => (
                                    <li key={rating}>
                                        <button
                                            className="dropdown-item"
                                            type="button"
                                            onClick={() => handleRatingSelect(rating)}
                                        >
                                            {rating}
                                            {selectedRating === rating && <CheckOutlinedIcon sx={{color:"green"}} />}
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