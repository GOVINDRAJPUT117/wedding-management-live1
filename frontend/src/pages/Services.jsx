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

import React, { useEffect, useState } from "react";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";
import { useCart } from "../pages/CartContext";
import "./Service.css";

function Services() {
  const [services, setServices] = useState([]);
  const { cartCount, setCartCount, setTotalPrice } = useCart();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    const token = user?.token;

    WebServices.getAPIUsingToken(WebAPI.fetchservice, token)
      .then((res) => {
        setServices(res.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, []);

  const handleBookNow = async (service) => {
    const user = JSON.parse(localStorage.getItem("userData"));
    const token = user?.token;

    if (!user || !token) {
      alert("Please login first!");
      return;
    }

    const bookingData = {
      userId: user._id,
      name: user.name,
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

      setCartCount(res.data.totalServices ?? cartCount + 1);
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

      <div className="row g-4 services-grid">
        {services.map((service) => (
          <div
            className="col-12 col-sm-6 col-lg-4"
            key={service._id}
          >
            <div className="card shadow service-card">
              <div className="service-image-wrapper">
                <img
                  src={`http://localhost:3000/uploads/${encodeURIComponent(
                    service.service_image || ""
                  )}`}
                  className="card-img-top service-image"
                  alt={service.service_name || "Wedding service"}
                  loading="lazy"
                />
              </div>

              <div className="card-body service-card-body">
                <h5 className="card-title service-title">
                  {service.service_name}
                </h5>

                <p className="card-text service-category">
                  <strong>Category:</strong>{" "}
                  {Array.isArray(service.category)
                    ? service.category
                        .map((cat) => cat.catName)
                        .filter(Boolean)
                        .join(", ")
                    : service.category?.catName || "General"}
                </p>

                <p className="card-text service-description">
                  {service.service_description}
                </p>

                <p className="card-text fw-bold service-price">
                  Price: ₹{service.service_price}
                </p>

                <button
                  className="btn btn-success w-100 mt-auto"
                  onClick={() => handleBookNow(service)}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
