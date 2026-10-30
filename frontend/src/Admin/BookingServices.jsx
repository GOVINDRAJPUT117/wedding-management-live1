
import React, { useEffect, useState } from "react";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";
import { useCart } from "../pages/CartContext";
import Card from "../card/Card";

function BookingServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const { cartCount, setCartCount } = useCart();

  useEffect(() => {
    const fetchPendingBookings = async () => {
      const user = JSON.parse(
        localStorage.getItem("userData") || "null"
      );
      const token = user?.token;

      try {
        const res = await WebServices.getAPIUsingToken(
          WebAPI.fetchPendingBookings,
          token
        );

        setServices(res.data.data || []);
      } catch (err) {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingBookings();
  }, []);

  const handleConfirm = async (id) => {
    const user = JSON.parse(
      localStorage.getItem("userData") || "null"
    );
    const token = user?.token;

    try {
      const res = await WebServices.postAPIUsingToken(
        `${WebAPI.ConfirmBook}/${id}`,
        { status: "confirmed" },
        token
      );

      if (res.data.status) {
        alert("Service confirmed successfully");

        setServices((previousServices) =>
          previousServices
            .map((cart) => ({
              ...cart,
              items: cart.items.filter(
                (item) => item._id.toString() !== id.toString()
              ),
            }))
            .filter((cart) => cart.items.length > 0)
        );

        setCartCount(
          res.data.totalServices ?? Math.max(0, cartCount - 1)
        );
      } else {
        alert("Failed to confirm service");
      }
    } catch (err) {
      alert("Error confirming service");
    }
  };

  return (
    <div className="container my-4">
      <h2
  className="text-center mb-4"
  style={{
    color: "#7d263f",
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "38px",
    fontWeight: "600",
  }}
>
  Pending Bookings
</h2>

      {loading ? (
        <p className="text-center">Loading bookings...</p>
      ) : services.length === 0 ? (
        <p className="text-center">
          No pending bookings available.
        </p>
      ) : (
        <div className="row">
          {services.map((cart) => (
            <React.Fragment key={cart.cartId}>
              {cart.items.map((item) => {
                const service = item.serviceId;

                if (!service) return null;

                return (
                  <div
                    className="col-12 col-sm-6 col-lg-4 mb-4"
                    key={item._id}
                  >
                    <Card
                      service={service}
                      showCategory={true}
                      showDescription={true}
                      showPrice={true}
                      truncateDescription={false}
                      extraInfo={
                        <p className="card-text fw-bold">
                          Name: {cart.user?.name}
                        </p>
                      }
                    >
                      <button
                        className="btn btn-success w-100 mt-2"
                        onClick={() => handleConfirm(item._id)}
                      >
                        Confirm
                      </button>
                    </Card>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingServices;
