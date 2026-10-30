// import React, { useEffect, useState } from "react";
// import WebServices from "../services/WebServices";
// import WebAPI from "../services/WebAPI";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../pages/CartContext"; // import context
// import './Service.css';

// function Services() {
//   const [services, setServices] = useState([]);
//   const navigate = useNavigate();
//   const { cartCount, setCartCount, totalPrice, setTotalPrice } = useCart(); // use cart context

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("userData"));
//     const token = user?.token;

//     WebServices.getAPIUsingToken(WebAPI.fetchservice, token)
//       .then((res) => {
//         setServices(res.data.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching services:", error);
//       });
//   }, []);

//   const handleBookNow = async (service) => {
//     const user = JSON.parse(localStorage.getItem("userData"));
//     const token = user?.token;

//     const bookingData = {
//       userId: user._id,
//       name: user.name,
//       serviceId: service._id,
//       serviceName: service.service_name,
//       price: service.service_price,
//       status: "pending"
//     };
//     console.log("yr jrur dekh lo",bookingData)

//     try {
//       const res = await WebServices.postAPIUsingToken(WebAPI.booknow, bookingData, token);
      
//       // ✅ Update Cart Context
//       // 1. Badge count = number of services in cart
//       setCartCount(res.data.totalServices || cartCount + 1); 
      
//       // 2. Total price = sum of all booked services
//       setTotalPrice(res.data.totalPrice || service.service_price);

//       alert("Item Added in Cart");
//     } catch (err) {
//       alert("Something Went Wrong!");
//       console.error("Error: ", err.response?.data || err.message);
//     }
//   };

//   return (
//     <div className="container my-4">
//       <h2 className="text-center mb-4">Services</h2>
//       <div className="row">
//         {services.map((service, index) => (
//           <div className="col-md-4 mb-4" key={index+1}>
//             <div className="card h-100 shadow">
//               <img
//                 src={`http://localhost:3000/uploads/${encodeURIComponent(service.service_image)}`}
//                 className="card-img-top"
//                 alt={service.service_name}
//                 style={{ height: "400px", objectFit: "cover" }}
//               />
//               <div className="card-body">
//                 <h5 className="card-title text-capitalize">
//                   Service Name: {service.service_name}
//                 </h5>
//                 <p className="card-text">
//                   <strong>Category:</strong>{" "}
//                   {Array.isArray(service.category)
//                     ? service.category.map((cat) => cat.catName).join(", ")
//                     : service.category?.catName}
//                 </p>
//                 <p className="card-text">{service.service_description}</p>
//                 <p className="card-text fw-bold">
//                   Price: ₹{service.service_price}
//                 </p>
//                 <button
//                   className="btn btn-success w-100 mt-2"
//                   onClick={() => handleBookNow(service)}
//                 >
//                   Book Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

     
     
//     </div>
//   );
// }

// export default Services;

// import React, { useEffect, useState } from "react";
// import WebServices from "../services/WebServices";
// import WebAPI from "../services/WebAPI";
// import { useCart } from "../pages/CartContext";
// import "./Service.css";

// function Services() {
//   const [services, setServices] = useState([]);
//   const { cartCount, setCartCount, setTotalPrice } = useCart();

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("userData"));
//     const token = user?.token;

//     WebServices.getAPIUsingToken(WebAPI.fetchservice, token)
//       .then((res) => {
//         setServices(res.data.data || []);
//       })
//       .catch((error) => {
//         console.error("Error fetching services:", error);
//       });
//   }, []);

//   const handleBookNow = async (service) => {
//     const user = JSON.parse(localStorage.getItem("userData"));
//     const token = user?.token;

//     if (!user || !token) {
//       alert("Please login first!");
//       return;
//     }

//     const bookingData = {
//       userId: user._id,
//       name: user.name,
//       serviceId: service._id,
//       serviceName: service.service_name,
//       price: service.service_price,
//       status: "pending",
//     };

//     try {
//       const res = await WebServices.postAPIUsingToken(
//         WebAPI.booknow,
//         bookingData,
//         token
//       );

//       setCartCount(res.data.totalServices ?? cartCount + 1);
//       setTotalPrice(
//         res.data.totalPrice ?? Number(service.service_price)
//       );

//       alert("Item Added in Cart");
//     } catch (err) {
//       alert("Something Went Wrong!");
//       console.error(
//         "Error:",
//         err.response?.data || err.message
//       );
//     }
//   };

//   return (
//     <div className="container my-4 services-page">
//       <h2 className="text-center mb-4">Services</h2>

//       <div className="row g-4 services-grid">
//         {services.map((service) => (
//           <div
//             className="col-12 col-sm-6 col-lg-4"
//             key={service._id}
//           >
//             <div className="card shadow service-card">
//               <div className="service-image-wrapper">
//                 <img
//                   src={`http://localhost:3000/uploads/${encodeURIComponent(
//                     service.service_image || ""
//                   )}`}
//                   className="card-img-top service-image"
//                   alt={service.service_name || "Wedding service"}
//                   loading="lazy"
//                 />
//               </div>

//               <div className="card-body service-card-body">
//                 <h5 className="card-title service-title">
//                   {service.service_name}
//                 </h5>

//                 <p className="card-text service-category">
//                   <strong>Category:</strong>{" "}
//                   {Array.isArray(service.category)
//                     ? service.category
//                         .map((cat) => cat.catName)
//                         .filter(Boolean)
//                         .join(", ")
//                     : service.category?.catName || "General"}
//                 </p>

//                 <p className="card-text service-description">
//                   {service.service_description}
//                 </p>

//                 <p className="card-text fw-bold service-price">
//                   Price: ₹{service.service_price}
//                 </p>

//                 <button
//                   className="btn btn-success w-100 mt-auto"
//                   onClick={() => handleBookNow(service)}
//                 >
//                   Book Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Services;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import WebServices from "../services/WebServices";
// import WebAPI from "../services/WebAPI";
// import { useCart } from "../pages/CartContext";
// import "./Service.css";

// function Services() {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const { cartCount, setCartCount, setTotalPrice } = useCart();
//   const navigate = useNavigate();

//   // Login details localStorage se read kar rahe hain.
//   // Guest ke paas valid userData/token nahi hoga.
//   const getUserData = () => {
//     try {
//       return JSON.parse(localStorage.getItem("userData"));
//     } catch (error) {
//       return null;
//     }
//   };

//   const user = getUserData();
//   const isLoggedIn = Boolean(
//     user?.isLoginStatus && user?.token
//   );

//   useEffect(() => {
//     const fetchServices = async () => {
//       const currentUser = getUserData();
//       const token = currentUser?.token;

//       try {
//         let res;

//         if (currentUser?.isLoginStatus && token) {
//           // Logged-in user: existing token-based API call preserve ki hai.
//           res = await WebServices.getAPIUsingToken(
//             WebAPI.fetchservice,
//             token
//           );
//         } else {
//           // Guest: public services endpoint use karne ki koshish.
//           // Ye tabhi kaam karega jab backend fetchservice route public ho.
//           res = await WebServices.getAPICall(WebAPI.fetchservice);
//         }

//         setServices(res.data.data || []);
//       } catch (error) {
//         console.error("Error fetching services:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchServices();
//   }, []);

//   const handleBookNow = async (service) => {
//     const currentUser = getUserData();

//     // Guest booking nahi kar sakta; Login page par bhej do.
//     if (
//       !currentUser?.isLoginStatus ||
//       !currentUser?.token
//     ) {
//       navigate("/login");
//       return;
//     }

//     const token = currentUser.token;

//     const bookingData = {
//       userId: currentUser._id,
//       name: currentUser.name,
//       serviceId: service._id,
//       serviceName: service.service_name,
//       price: service.service_price,
//       status: "pending",
//     };

//     try {
//       const res = await WebServices.postAPIUsingToken(
//         WebAPI.booknow,
//         bookingData,
//         token
//       );

//       setCartCount(res.data.totalServices ?? cartCount + 1);

//       setTotalPrice(
//         res.data.totalPrice ?? Number(service.service_price)
//       );

//       alert("Item Added in Cart");
//     } catch (err) {
//       alert("Something Went Wrong!");

//       console.error(
//         "Error:",
//         err.response?.data || err.message
//       );
//     }
//   };

//   return (
//     <div className="container my-4 services-page">
//       <h2 className="text-center mb-4">Services</h2>

//       {loading ? (
//         <p className="text-center">Loading services...</p>
//       ) : services.length === 0 ? (
//         <p className="text-center">No services available.</p>
//       ) : (
//         <div className="row g-4 services-grid">
//           {services.map((service) => (
//             <div
//               className="col-12 col-sm-6 col-lg-4"
//               key={service._id}
//             >
//               <div className="card shadow service-card">
//                 <div className="service-image-wrapper">
//                   <img
//                     src={`http://localhost:3000/uploads/${encodeURIComponent(
//                       service.service_image || ""
//                     )}`}
//                     className="card-img-top service-image"
//                     alt={service.service_name || "Wedding service"}
//                     loading="lazy"
//                   />
//                 </div>

//                 <div className="card-body service-card-body">
//                   <h5 className="card-title service-title">
//                     {service.service_name}
//                   </h5>

//                   <p className="card-text service-category">
//                     <strong>Category:</strong>{" "}
//                     {Array.isArray(service.category)
//                       ? service.category
//                           .map((cat) => cat.catName)
//                           .filter(Boolean)
//                           .join(", ")
//                       : service.category?.catName || "General"}
//                   </p>

//                   <p className="card-text service-description">
//                     {service.service_description}
//                   </p>

//                   <p className="card-text fw-bold service-price">
//                     Price: ₹{service.service_price}
//                   </p>

//                   {/* Guest ko Login to Book; logged-in user ko Book Now. */}
//                   {isLoggedIn ? (
//                     <button
//                       className="btn btn-success w-100 mt-auto"
//                       onClick={() => handleBookNow(service)}
//                     >
//                       Book Now
//                     </button>
//                   ) : (
//                     <button
//                       className="btn btn-outline-success w-100 mt-auto"
//                       onClick={() => navigate("/login")}
//                     >
//                       Login to Book
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Services;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";
import { useCart } from "../pages/CartContext";
import Card from "../card/Card";
import "./Service.css";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const { cartCount, setCartCount, setTotalPrice } = useCart();
  const navigate = useNavigate();

  const getUserData = () => {
    try {
      return JSON.parse(localStorage.getItem("userData"));
    } catch (error) {
      return null;
    }
  };

  const user = getUserData();
  const isLoggedIn = Boolean(
    user?.isLoginStatus && user?.token
  );

  useEffect(() => {
    const fetchServices = async () => {
      const currentUser = getUserData();
      const token = currentUser?.token;

      try {
        let res;

        if (currentUser?.isLoginStatus && token) {
          res = await WebServices.getAPIUsingToken(
            WebAPI.fetchservice,
            token
          );
        } else {
          res = await WebServices.getAPICall(
            WebAPI.fetchservice
          );
        }

        setServices(res.data.data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookNow = async (service) => {
    const currentUser = getUserData();

    if (
      !currentUser?.isLoginStatus ||
      !currentUser?.token
    ) {
      navigate("/login");
      return;
    }

    const token = currentUser.token;

    const bookingData = {
      userId: currentUser._id,
      name: currentUser.name,
      serviceId: service._id,
      serviceName: service.service_name,
      price: service.service_price,
      status: "pending",
    };

    try {
      const res = await WebServices.postAPIUsingToken(
        WebAPI.booknow,
        bookingData,
        token
      );

      setCartCount(
        res.data.totalServices ?? cartCount + 1
      );

      setTotalPrice(
        res.data.totalPrice ?? Number(service.service_price)
      );

      alert("Item Added in Cart");
    } catch (err) {
      alert("Something Went Wrong!");

      console.error(
        "Error:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="container my-4 services-page">
      <h2 className="text-center mb-4">Services</h2>

      {loading ? (
        <p className="text-center">Loading services...</p>
      ) : services.length === 0 ? (
        <p className="text-center">No services available.</p>
      ) : (
        <div className="row g-4 services-grid">
          {services.map((service) => (
            <div
              className="col-12 col-sm-6 col-lg-4"
              key={service._id}
            >
              <Card service={service}>
                {isLoggedIn ? (
                  <button
                    className="btn btn-success"
                    onClick={() => handleBookNow(service)}
                  >
                    Book Now
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-success"
                    onClick={() => navigate("/login")}
                  >
                    Login to Book
                  </button>
                )}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Services;


