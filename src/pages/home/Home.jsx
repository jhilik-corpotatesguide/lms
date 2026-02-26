import React, { useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";

import heroBg from "../../assets/hero-bg.png";
import logo from "../../assets/CG Logo.jpg";

export default function Home() {

  // state to open/close mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>

      {/* NAVBAR */}
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
          <li>Faculty</li>
          <li><Link to="/course">Courses</Link></li>
          <li>Resources</li>
          <li>News</li>
          <li>About</li>
          <li>Contact</li>
        </ul>

      </div>

      {/* HERO BACKGROUND */}
      <section
        className="hero-bg"
        style={{ backgroundImage: `url(${heroBg})` }}
      ></section>

    </div>
  );
}
