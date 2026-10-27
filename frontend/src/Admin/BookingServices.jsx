import React, { useEffect, useState } from "react";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";
import { useCart } from "../pages/CartContext";

function BookingServices() {
  const [services, setServices] = useState([]);
   const { cartCount, setCartCount, totalPrice, setTotalPrice } = useCart();
   
 useEffect(() => {
  var user = JSON.parse(localStorage.getItem("userData"));
  var token = user?.token;

  WebServices.getAPIUsingToken(WebAPI.fetchPendingBookings, token)
    .then((res) => {
      setServices(res.data.data[0].items);
      console.log("Bookings fetched:", res.data.data[0].items);
      console.log("abb pura data",res.data.data)
    })
    .catch((err) => {
      console.error("Booking fetch error", err);
    });
}, []);
  // Confirm Button Handler
  const handleConfirm = async (id) => {
    3
    console.log("id is here"+id)
     var user = JSON.parse(localStorage.getItem("userData"));
    var token = user?.token;
    console.log("Token from localStorage:", token);

    try {
      const res = await WebServices.postAPIUsingToken(
        `${WebAPI.ConfirmBook}/${id}`,
        { status: "confirmed" },
        token
      );

      if (res.data.status) {
        alert(" Service confirmed successfully");

        // Optional: update service list
       setServices((prevServices) =>
        prevServices.filter(service => service._id.toString() !== id.toString())
      );

       setCartCount(res.data.totalServices || cartCount - 1); 
      
      } else {
        alert(" Failed to confirm service");
      }
    } catch (err) {
      console.error("Error confirming service:", err);
      alert(" Error confirming service");
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Services</h2>
      <div className="row">
      {services.map((service) => (
  <div className="col-md-4 mb-4" key={service._id}>
    <div className="card h-100 shadow">
      <img
       
        src={`http://localhost:3000/uploads/${encodeURIComponent(service.serviceId?.service_image)}`}
        className="card-img-top"
        alt={service.serviceId?.service_name}
        style={{ height: "400px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title text-capitalize">
          Service Name: {service.serviceId?.service_name}
        </h5>
        <p className="card-text">
          <strong>Category:</strong>{" "}
         {Array.isArray(service.serviceId?.category)
  ? service.serviceId.category.map((cat) => cat.catName).join(", ")
  : service.serviceId?.category?.catName || "N/A"}
        </p>
        <p className="card-text">{service.serviceId?.service_description}</p>
        <p className="card-text fw-bold">name :{service.name}</p>
        <p className="card-text fw-bold">
          Price: ₹{service.serviceId?.service_price}
        </p>

        {/*  Confirm Button */}
        <button
          className="btn btn-success w-100 mt-2"
          onClick={() => handleConfirm(service._id)}
        >
           Confirm
        </button>
      </div>
    </div>
  </div>
))}
      </div>
    </div>
  );
}

export default BookingServices;




