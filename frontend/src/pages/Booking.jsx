import React, { useEffect, useState } from "react";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";
import Card from "../card/Card";

function Booking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("userData"));
        const token = user?.token;

        const res = await WebServices.getAPIUsingToken(
          WebAPI.fetchConfirmedBookings,
          token
        );

        setBookings(res.data.data || []);
      } catch (error) {
        // Error handled without exposing technical details
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container my-4">
      <h2
        className="text-center mb-4"
        style={{
          color: "#7d263f",
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: "38px",
          fontWeight: "600",
          letterSpacing: "0.5px",
        }}
      >
        Confirmed Bookings
      </h2>

      {loading ? (
        <p className="text-center">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center">No confirmed bookings found.</p>
      ) : (
        <div className="row g-4">
          {bookings.map((booking) => {
            const service = booking.serviceId;

            if (!service) return null;

            return (
              <div
                className="col-12 col-sm-6 col-lg-4"
                key={booking._id}
              >
                <Card
                  service={service}
                  showCategory={true}
                  showDescription={false}
                  showPrice={true}
                  extraInfo={
                    <>
                      <p className="card-text">
                        <strong>Booked By:</strong>{" "}
                        {booking.userId?.name || "N/A"}
                      </p>

                      <p className="card-text">
                        <strong>Status:</strong>{" "}
                        {booking.status || "N/A"}
                      </p>
                    </>
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Booking;
