
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useCart } from "../pages/CartContext";

import {
  FaHome,
  FaConciergeBell,
  FaBookOpen,
  FaSignInAlt,
  FaHeart,
  FaUserCircle,
  FaShoppingCart,
  FaList,
  FaSignOutAlt
} from 'react-icons/fa';

const Navbar = ({ userData, setUserData }) => {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const loginstatus = Boolean(
    userData?.isLoginStatus && userData?.token
  );

  const handleLogout = () => {
    localStorage.removeItem("userData");

    setUserData({
      isLoginStatus: false,
      role: undefined,
    });

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg shaadi-navbar sticky-top">
      <div className="container-fluid">

        <Link
          className="navbar-brand brand-logo d-flex align-items-center"
          to="/"
        >
          <FaHeart className="me-2 heart-icon" />
          ShaadiVibes
        </Link>

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
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link
                className="nav-link nav-link-custom"
                to="/"
              >
                <FaHome className="me-1" />
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link nav-link-custom"
                to="/services"
              >
                <FaConciergeBell className="me-1" />
                Services
              </Link>
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
                <FaList className="me-1" />
                Categories
              </Link>

              <ul
                className="dropdown-menu"
                aria-labelledby="navbarCategory"
              >
                <li>
                  <Link
                    className="dropdown-item"
                    to="/category/photography"
                  >
                    Photography
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item"
                    to="/category/food & catering"
                  >
                    Food & Catering
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item"
                    to="/category/decoration"
                  >
                    Decoration
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item"
                    to="/category/bridal & groom makeup"
                  >
                    Bridal & Groom Makeup
                  </Link>
                </li>
              </ul>
            </li>

            {loginstatus && (
              <li className="nav-item">
                <Link
                  className="nav-link nav-link-custom"
                  to="/bookings"
                >
                  <FaBookOpen className="me-1" />
                  My Bookings
                </Link>
              </li>
            )}

            {loginstatus && (
              <li className="nav-item">
                <Link
                  className="nav-link nav-link-custom position-relative"
                  to="/AddToCart"
                >
                  <FaShoppingCart className="me-1" />
                  Cart

                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            )}

            {loginstatus && (
              <li className="nav-item">
                <Link
                  className="nav-link nav-link-custom"
                  to="/profilePage"
                >
                  <FaUserCircle className="me-1" />
                  Profile
                </Link>
              </li>
            )}

            {!loginstatus && (
              <li className="nav-item">
                <Link
                  className="nav-link nav-link-custom"
                  to="/login"
                >
                  <FaSignInAlt className="me-1" />
                  Login
                </Link>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
