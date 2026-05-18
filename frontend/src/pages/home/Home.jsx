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

      
      {/* HERO BACKGROUND */}
      <section
        className="hero-bg"
        style={{ backgroundImage: `url(${heroBg})` }}
      ></section>

    </div>
  );
}
