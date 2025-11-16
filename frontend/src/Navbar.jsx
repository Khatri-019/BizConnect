import DuoIcon from '@mui/icons-material/Duo';
import "./Navbar.css"

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container-fluid">
        <a className="navbar-brand my-brand" href="#">
          <span className="me-2">
            <DuoIcon sx={{ fontSize: "4rem", marginRight:"0.4rem", color: "black" }} />
          </span>
          BizConnect
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a className="nav-link my-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link my-link" href="/experts">Find Experts</a>
            </li>
            <li className="nav-item">
              <a className="nav-link my-link" href="/about">About Us</a>
            </li>
            <li className="nav-item">
              <a className="nav-link my-link" href="/support">Support</a>
            </li>
          </ul>

          <div className="d-flex align-items-center right-links">
            <a href="#" className="nav-link me-3 sign-in">Sign In</a>
            <a href="#" className="btn get-started">Get Started</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
