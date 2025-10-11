import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './AdminNavbar.css';

const AdminNavbar = ({ setUserData }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUserData({ isLoginStatus: false, role: undefined });
    navigate("/login");
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar admin-navbar sticky-top shadow-sm">
      <div className="container-fluid">
        <div className="navbar-brand admin-brand">
          🛠️ Wedding Admin Panel
        </div>

        {/* Menu always visible, no toggle */}
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex flex-row">
          <li className="nav-item">
            <Link className={`nav-link admin-nav-link ${isActive("/Admin")}`} to="/Admin">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link admin-nav-link ${isActive("/ViewUser")}`} to="/ViewUser">
              Users
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link admin-nav-link ${isActive("/addservice")}`} to="/addservice">
              Add Services
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link admin-nav-link ${isActive("/admin/bookingService")}`} to="/admin/bookingService">
              Bookings
            </Link>
          </li>
          <li className="nav-item">
            <button onClick={handleLogout} className="btn btn-link admin-nav-link text-danger">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
