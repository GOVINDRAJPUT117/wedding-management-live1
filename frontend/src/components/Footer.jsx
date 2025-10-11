import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-danger text-white pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row text-center text-md-start">
          {/* Logo / About */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">ShaadiVibes</h5>
            <p>Celebrating your special moments with elegance and style. Your perfect wedding partner!</p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white text-decoration-none">Home</a></li>
              <li><a href="/services" className="text-white text-decoration-none">Services</a></li>
              <li><a href="/bookings" className="text-white text-decoration-none">Bookings</a></li>
              <li><a href="/login" className="text-white text-decoration-none">Login</a></li>
              <li><a href="/profilePage" className="text-white text-decoration-none">Profile</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">Follow Us</h5>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a href="#" className="text-white fs-5"><FaFacebookF /></a>
              <a href="#" className="text-white fs-5"><FaInstagram /></a>
              <a href="#" className="text-white fs-5"><FaTwitter /></a>
            </div>
          </div>
        </div>

        <hr className="border-secondary" />

        {/* Bottom line */}
        <div className="text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} ShaadiVibes. All Rights Reserved. <br />
            Designed with <FaHeart className="text-danger" /> by Govind Rajput
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

