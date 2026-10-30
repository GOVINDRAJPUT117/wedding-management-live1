
import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaHeart,
  FaArrowRight
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="shaadi-footer">
      <div className="footer-main container">
        <div className="row g-4">

          <div className="col-lg-5 col-md-6">
            <Link to="/" className="footer-brand">
              <FaHeart className="footer-heart" />
              ShaadiVibes
            </Link>

            <p className="footer-about">
              Every love story deserves a beautiful celebration.
              Discover wedding services and bring your dream wedding
              to life with ShaadiVibes.
            </p>

            <div className="footer-socials">
              <a href="#" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter />
              </a>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="footer-heading">Quick Links</h5>

            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Our Services</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-12">
            <h5 className="footer-heading">Make Your Day Special</h5>

            <p className="footer-contact-text">
              From beautiful decorations to unforgettable photographs,
              find the services that make your celebration memorable.
            </p>

            <Link to="/services" className="footer-explore">
              Explore Services <FaArrowRight />
            </Link>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>
            © {new Date().getFullYear()} ShaadiVibes. All Rights Reserved.
          </p>

          <p>
            Made with <FaHeart className="footer-bottom-heart" /> for
            beautiful celebrations.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
