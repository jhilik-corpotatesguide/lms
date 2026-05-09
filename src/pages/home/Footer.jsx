import { useLocation } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { MdPhone, MdLocationOn, MdEmail } from "react-icons/md";
import "./Footer.css";

import logo from "../../assets/CG Logo.jpg";

export default function Footer() {
  const location = useLocation();

  // এই page গুলোতে Footer দেখাবে না
  const hideOn = ["/login", "/dashboard"];
  if (hideOn.includes(location.pathname)) return null;

  return (
    <footer className="footer">

      
      <div className="footer-content">

        {/* ── Column 1: Logo + Contact ── */}
        <div className="footer-col">
          <img src={logo} alt="Corporates Guide" className="footer-logo" />

          <div className="footer-contact">
            <p><MdPhone className="footer-icon" /> +91 6289 597 268</p>
            <p><MdLocationOn className="footer-icon" /> 56/2F, Santosh Roy Road Barisha-Sakher Bazar Kolkata - 700008</p>
            <p><MdEmail className="footer-icon" /> support@corporatesguide.com</p>
          </div>

          {/* Social Icons */}
          <div className="footer-social">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>

        {/* ── Column 2: Links ── */}
        <div className="footer-col">
          <h4 className="footer-heading">Links</h4>
          <ul className="footer-links">
            <li><a href="#">About</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Become a Trainer</a></li>
          </ul>
        </div>

        {/* ── Column 3: ISO Badge ── */}
        <div className="footer-col footer-col--center">
          <div className="footer-badge">
            <div className="iso-badge">
              <div className="iso-inner">
                <p className="iso-cert">CERTIFIED</p>
                <p className="iso-num">ISO</p>
                <p className="iso-std">9001</p>
                <p className="iso-comp">COMPANY</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Column 4: Recognised by ── */}
        <div className="footer-col">
          <h4 className="footer-heading">Recognised by:</h4>
          <div className="footer-msme">
            <p className="msme-title">🏛️ MSME</p>
            <p className="msme-sub">Ministry of MSME, Govt. of India</p>
          </div>
        </div>

      </div>

      {/* ── Bottom Bar ── */}
      <div className="footer-bottom">
        <p>© Corporates Guide. Powered by Incfrog</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Sitemap</a>
        </div>
      </div>

    </footer>
  );
}