import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

import logo from "../../assets/CG Logo.jpg";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ localStorage থেকে user info নাও
  const userName  = localStorage.getItem("user_name")  || "";
  const userEmail = localStorage.getItem("user_email") || "";
  const isLoggedIn = !!userEmail; // email থাকলে logged in

  // এই page গুলোতে Navbar দেখাবে না
  const hideOn = ["/login", "/dashboard"];
  if (hideOn.includes(location.pathname)) return null;

  // Avatar — নামের প্রথম অক্ষর
  const avatar = userName ? userName.charAt(0).toUpperCase() : "U";

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_id");
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <div className="navbar">

      {/* Logo */}
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      {/* Hamburger icon (mobile only) */}
      <div
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      {/* Menu */}
      <ul className={`menu ${menuOpen ? "active-menu" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/course">Courses</Link></li>
        <li>Resources</li>
        <li>Calendar</li>
        <li>Contact</li>

        {/* ✅ Login হলে Profile, না হলে Login button */}
        {isLoggedIn ? (
          <li className="nav-profile-wrapper">
            <div
              className="nav-avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              title="My Profile"
            >
              {avatar}
            </div>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="nav-dropdown">

                {/* Header */}
                <div className="nav-dropdown-header">
                  <div className="nav-dropdown-avatar">{avatar}</div>
                  <div className="nav-dropdown-name">{userName || "User"}</div>
                  <div className="nav-dropdown-email">{userEmail}</div>
                </div>

                {/* Info rows */}
                <div className="nav-dropdown-body">
                  <div className="nav-info-row">
                    <span className="nav-info-icon">👤</span>
                    <div className="nav-info-text">
                      <span className="nav-info-label">Full Name</span>
                      <span className="nav-info-value">{userName || "User"}</span>
                    </div>
                  </div>

                  <div className="nav-info-row">
                    <span className="nav-info-icon">✉️</span>
                    <div className="nav-info-text">
                      <span className="nav-info-label">Email Address</span>
                      <span className="nav-info-value">{userEmail}</span>
                    </div>
                  </div>

                  <button className="nav-logout" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>

              </div>
            )}
          </li>
        ) : (
          <li>
            <Link to="/login" className="login-btn">Login</Link>
          </li>
        )}

      </ul>

    </div>
  );
}