import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useCart } from "../pages/CartContext";
import {
  FaHome, FaConciergeBell, FaBookOpen, FaUserPlus, FaSignInAlt,
  FaHeart, FaUserCircle, FaShoppingCart, FaList
} from 'react-icons/fa';

const Navbar = () => {
  const [loginstatus, setLoginStatus] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation(); 
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setLoginStatus(userData?.isLoginStatus || false);
  }, [location]); 

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search/${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // search ke baad input clear
    }
  };

  return (
    <nav className="navbar navbar-expand-lg shaadi-navbar sticky-top">
      <div className="container-fluid">
        <div className="navbar-brand brand-logo d-flex align-items-center">
          <FaHeart className="me-2 heart-icon" />
          ShaadiVibes
        </div>

        {/* Search Box */}
        <div className="search-container ms-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
          />
        </div>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
             {!loginstatus &&  <Link className="nav-link nav-link-custom" to="/"><FaHome className="me-1" /> Home</Link>}
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/services"><FaConciergeBell className="me-1" /> Services</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/bookings"><FaBookOpen className="me-1" /> Bookings</Link>
            </li>

            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle nav-link-custom"
                to="#"
                id="navbarCategory"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaList className="me-1" /> Categories
              </Link>
              <ul className="dropdown-menu" aria-labelledby="navbarCategory">
                <li><Link className="dropdown-item" to="/category/photography">Photography</Link></li>
                <li><Link className="dropdown-item" to="/category/makeup">Makeup</Link></li>
                <li><Link className="dropdown-item" to="/category/drinks">Drinks</Link></li>
                <li><Link className="dropdown-item" to="/category/food-catering">Colorful Mocktail</Link></li>
              </ul>
            </li>

           <li className="nav-item">
              <Link className="nav-link nav-link-custom position-relative" to="/AddToCart">
                <FaShoppingCart className="me-1" />
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
                Cart
              </Link>
            </li>

            {loginstatus ? (
              <li className="nav-item">
                <Link className="nav-link nav-link-custom" to="/profilePage"><FaUserCircle className="me-1" /> Profile</Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link nav-link-custom" to="/login"><FaSignInAlt className="me-1" /> Login</Link>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
