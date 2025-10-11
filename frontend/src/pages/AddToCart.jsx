import React, { useEffect, useState } from "react";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";
import { useCart } from "./CartContext"; 

function AddToCart() {
  const [bookingList, setBookingList] = useState([]);
  const { cartCount, setCartCount, totalPrice, setTotalPrice } = useCart(); 
  
  const fetchBookings = () => {
    const user = JSON.parse(localStorage.getItem("userData"));
    const token = user?.token;
    const userId = user?._id;

    if (!userId || !token) return;

    WebServices.getAPIUsingToken(`${WebAPI.fetchCart}/${userId}`, token)
      .then((res) => {
        const data = res.data.data.items;
        setBookingList(data);
        setCartCount(data.length); 
        const price = data.reduce((acc, item) => acc + (item.serviceId?.service_price || 0), 0);
        setTotalPrice(price);
      })
      .catch((err) => {
        console.error("Booking fetch error", err);
      });
  };

  useEffect(() => {
    fetchBookings(); 
  }, []);

  const removeService = async (id) => {
    const user = JSON.parse(localStorage.getItem("userData"));
    const token = user?.token;

    try {
      const response = await WebServices.deleteAPIUsingToken(`${WebAPI.RemoveCartItems}/${id}`, token);

      if (response.data.status) {
        const updatedList = bookingList.filter((item) => item._id !== id);
        setBookingList(updatedList);
        setCartCount(updatedList.length); 
        const price = updatedList.reduce((acc, item) => acc + (item.serviceId?.service_price || 0), 0);
        setTotalPrice(price);
      } else {
        alert("Service not removed. Try again!");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error while deleting service");
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">🧾 My Booking Cart</h2>
      {bookingList.length === 0 ? (
        <h5 className="text-center text-muted">No services booked yet!</h5>
      ) : (
        <>
          <div className="row">
            {bookingList.map((booking) => (
              <div className="col-md-4 mb-4" key={booking._id}>
                <div className="card h-100 shadow">
                  <img
                     src={`http://localhost:3000/uploads/${encodeURIComponent(booking.serviceId?.service_image)}`}
                     className="card-img-top"
                     alt={booking.serviceId?.service_name}
                     style={{ height: "400px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{booking.serviceId?.service_name}</h5>
                    <p className="card-text">{booking.serviceId?.service_description}</p>
                    <p className="fw-bold">₹ {booking.serviceId?.service_price}</p>
                    <button
                      className="btn btn-danger w-100"
                      onClick={() => removeService(booking._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Payment */}
          <div className="mt-4 text-end">
            <h4>Total Payment: ₹{totalPrice}</h4>
          </div>
        </>
      )}
    </div>
  );
}

export default AddToCart;
