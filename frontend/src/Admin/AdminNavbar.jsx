import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

import {
  FaTachometerAlt,
  FaUsers,
  FaConciergeBell,
  FaBookOpen,
  FaSignOutAlt
} from "react-icons/fa";

const AdminNavbar = ({ setUserData }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userData");

    setUserData({
      isLoginStatus: false,
      role: undefined,
    });

    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path ? "active" : "";

  return (
    <nav className="navbar navbar-expand-lg admin-navbar sticky-top">
      <div className="container-fluid">

        {/* Logo unchanged */}
        <div className="navbar-brand admin-brand">
          🛠️ Wedding Admin Panel
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link
                className={`nav-link admin-nav-link ${isActive("/Admin")}`}
                to="/Admin"
              >
                <FaTachometerAlt className="me-1" />
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className={`nav-link admin-nav-link ${isActive("/ViewUser")}`}
                to="/ViewUser"
              >
                <FaUsers className="me-1" />
                Users
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className={`nav-link admin-nav-link ${isActive("/addservice")}`}
                to="/addservice"
              >
                <FaConciergeBell className="me-1" />
                Add Services
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className={`nav-link admin-nav-link ${isActive("/admin/bookingService")}`}
                to="/admin/bookingService"
              >
                <FaBookOpen className="me-1" />
                Bookings
              </Link>
            </li>

            <li className="nav-item">
              <button
                type="button"
                onClick={handleLogout}
                className="nav-link admin-nav-link admin-logout"
              >
                <FaSignOutAlt className="me-1" />
                Logout
              </button>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
