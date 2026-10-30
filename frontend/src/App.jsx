
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Services from './pages/Services';
import Booking from './pages/Booking';
import AddToCart from './pages/AddToCart';
import ProfilePage from './Profile/ProfilePage2';

import AdminNavbar from './Admin/AdminNavbar';

import ViewUser from './Admin/ViewUser';
import AddService from './Admin/AddService';
import BookingServices from './Admin/BookingServices';
import CategoryServiceList from './category/CategoryServiceList';
import Dashboard from './Admin/DashBoard';

function App() {

  const [userData, setUserData] = useState(() => {
    try {
      const stored = localStorage.getItem("userData");

      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
    }

    return {
      isLoginStatus: false,
      role: undefined,
    };
  });

  const isAdmin =
    userData.isLoginStatus && userData.role === 'admin';

  return (
    <>
      {isAdmin ? (
        <AdminNavbar setUserData={setUserData} />
      ) : (
        <Navbar
          userData={userData}
          setUserData={setUserData}
        />
      )}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/login"
          element={<Login setUserData={setUserData} />}
        />

        <Route path="/services" element={<Services />} />

        <Route path="/bookings" element={<Booking />} />

        <Route path="/AddToCart" element={<AddToCart />} />

        <Route
          path="/category/:name"
          element={<CategoryServiceList />}
        />

        <Route
          path="/profilePage"
          element={<ProfilePage setUserData={setUserData} />}
        />

        <Route
          path="/Admin"
          element={
            isAdmin ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/addservice"
          element={
            isAdmin ? <AddService /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/viewuser"
          element={
            isAdmin ? <ViewUser /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin/bookingService"
          element={
            isAdmin ? <BookingServices /> : <Navigate to="/login" replace />
          }
        />
      </Routes>

      {!isAdmin && <Footer />}
    </>
  );
}

export default App;

