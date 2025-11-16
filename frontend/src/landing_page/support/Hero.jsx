import "./Hero.css";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";

function Hero() {
    return (
        <div className="container-fluid support-hero-container">
            <div className="row hero-row">
                <div>
                    <HeadphonesOutlinedIcon fontSize="medium" />
                    <span >Support Center</span>
                </div>

                <div>
                    <h1>How Can We  <span className="colored-text"> Help You Today ?</span> </h1>
                    <p>
                        Find answers, get support, and learn how to make the most of
                        BizConnect. <br />
                        Our comprehensive help center is here 24/7.
                    </p>
                </div>

                <div class="search-bar d-flex align-items-center">
                    <span class="search-icon ms-3 me-2">
                        <i class="bi bi-search"></i>
                    </span>
                    <input
                        type="text"
                        class="form-control border-0 shadow-none flex-grow-1"
                        placeholder="Search for help articles, guides, or features..."
                    />
                    <button class="btn btn-dark rounded-3 px-4 ms-2">Search</button>
                </div>
            </div>
        </div>
    );
}

export default Hero;
