
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Services from './pages/Services';
import Booking from './pages/Booking';
import AddToCart from './pages/AddToCart';
import ProfilePage from'./Profile/ProfilePage2';

import AdminNavbar from './Admin/AdminNavbar';

import ViewUser from './Admin/ViewUser';

import AddService from './Admin/AddService';
import BookingServices from './Admin/BookingServices';
import AdminServices from './Admin/AdminServices';
import CategoryServiceList from './category/CategoryServiceList';

function App() {
  const [userData, setUserData] = useState({
    isLoginStatus: false,
    role: undefined,
  });

  useEffect(() => {
    const stored = localStorage.getItem('userData');
    if (stored) {
      setUserData(JSON.parse(stored));
    }
  }, []);

  const isAdmin = userData.isLoginStatus && userData.role === 'admin';

  return (
    <>
      
      {isAdmin ? <AdminNavbar setUserData={setUserData}/> : <Navbar />}

      <Routes>
       
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUserData={setUserData} />} />
        <Route path="/services" element={<Services />} />
        <Route path="/bookings" element={<Booking />} />
        <Route path="/AddToCart" element={<AddToCart />} />
        <Route path="/category/:name" element={<CategoryServiceList />} />
        <Route path="/profilePage" element={<ProfilePage />} />
        
       

       
        {isAdmin && (
          <>
           <Route path="/Admin" element={<AdminServices />} />
          <Route path="/addservice" element={<AddService />} />
          <Route path="/viewuser" element={<ViewUser />} />
          <Route path="/admin/bookingService" element={<BookingServices />} />
        

               
             
          </>
        )}
      </Routes>

       {!isAdmin && (
          <>
            <Footer />   
          </>
        )}
        

      
      
    </>
  );
}

export default App;
