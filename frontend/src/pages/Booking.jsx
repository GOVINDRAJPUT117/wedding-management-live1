import React, { useEffect, useState } from "react";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";

function Booking() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    const token = user?.token;

    WebServices.getAPIUsingToken(WebAPI.fetchConfirmedBookings, token)
      .then((res) => {
        console.log("Confirmed bookings response ===>", res);
        setBookings(res.data?.data || []);
      })
      .catch((err) => {
        console.error("Error fetching confirmed bookings", err);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Confirmed Bookings</h2>
      <div className="row">
        {bookings.length === 0 ? (
          <p className="text-center">No confirmed bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div className="col-md-4 mb-4" key={booking._id}>
              <div className="card shadow h-100">
                <img
                  src={`http://localhost:3000/uploads/${encodeURIComponent(booking.serviceId?.service_image)}`}
                  className="card-img-top"
                  alt={booking.serviceId?.service_name}
                  style={{ height: "400px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-capitalize">
                    {booking.serviceId?.service_name}
                  </h5>
                  <p className="card-text">
                    <strong>Category:</strong>{" "}
                    {Array.isArray(booking.serviceId?.category)
                      ? booking.serviceId.category.map(cat => cat.catName).join(", ")
                      : booking.serviceId?.category?.catName}
                  </p>
                  <p className="card-text">
                    <strong>Price:</strong> ₹{booking.serviceId?.service_price}
                  </p>
                  <p className="card-text">
                    <strong>Booked By:</strong> {booking.userId?.name}
                  </p>
                  <p className="card-text text-success fw-bold">
                    <strong>Status:</strong> {booking.status}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Booking;
