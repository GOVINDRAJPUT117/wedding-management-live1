import React, { useEffect, useState, useCallback } from "react";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";
import { useCart } from "./CartContext";
import Card from "../card/Card";

function AddToCart() {
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    cartCount,
    setCartCount,
    setTotalPrice,
    refreshCart,
  } = useCart();

  const getTotalPrice = (items) => {
    return items.reduce((total, item) => {
      return (
        total +
        Number(item.serviceId?.service_price ?? item.price ?? 0)
      );
    }, 0);
  };

  const fetchCart = useCallback(async () => {
    let userData;

    try {
      userData = JSON.parse(
        localStorage.getItem("userData") || "null"
      );
    } catch {
      userData = null;
    }

    const token = userData?.token;
    const userId = userData?._id;

    if (!userId || !token || !userData?.isLoginStatus) {
      setBookingList([]);
      setCartCount(0);
      setTotalPrice(0);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await WebServices.getAPIUsingToken(
        `${WebAPI.fetchCart}/${userId}`,
        token
      );

      const items = res.data?.data?.items || [];

      setBookingList(items);
      setCartCount(items.length);
      setTotalPrice(getTotalPrice(items));
    } catch (error) {
      setBookingList([]);
      setCartCount(0);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  }, [setCartCount, setTotalPrice]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const handleUserChange = () => {
      fetchCart();
    };

    window.addEventListener("userLogin", handleUserChange);
    window.addEventListener("userLogout", handleUserChange);

    return () => {
      window.removeEventListener("userLogin", handleUserChange);
      window.removeEventListener("userLogout", handleUserChange);
    };
  }, [fetchCart]);

  const removeService = async (id) => {
    let userData;

    try {
      userData = JSON.parse(
        localStorage.getItem("userData") || "null"
      );
    } catch {
      userData = null;
    }

    const token = userData?.token;

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      const res = await WebServices.deleteAPIUsingToken(
        `${WebAPI.RemoveCartItems}/${id}`,
        token
      );

      if (res.status === 200) {
        const updatedList = bookingList.filter(
          (item) => item._id !== id
        );

        setBookingList(updatedList);
        setCartCount(updatedList.length);
        setTotalPrice(getTotalPrice(updatedList));

        window.dispatchEvent(new Event("cartUpdated"));

        alert("Item removed from cart");
      }
    } catch (error) {
      alert("Unable to remove item from cart.");
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
          letterSpacing: "0.5px",
        }}
      >
        My Cart
      </h2>

      {loading ? (
        <p className="text-center">Loading cart...</p>
      ) : bookingList.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          <div className="row g-4">
            {bookingList.map((item) => {
              const service = item.serviceId;

              if (!service) return null;

              return (
                <div
                  className="col-12 col-sm-6 col-lg-4"
                  key={item._id}
                >
                  <Card
                    service={service}
                    showCategory={false}
                    showDescription={true}
                    showPrice={true}
                    truncateDescription={false}
                  >
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeService(item._id)}
                    >
                      Remove
                    </button>
                  </Card>
                </div>
              );
            })}
          </div>

          <div
            className="text-end mt-4 p-3"
            style={{
              borderTop: "1px solid #eadde0",
              color: "#302329",
            }}
          >
            <h5>Cart Items: {cartCount}</h5>

            <h4
              style={{
                color: "#7d263f",
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontWeight: "600",
                marginTop: "12px",
              }}
            >
              Total Payment: ₹
              {getTotalPrice(bookingList).toLocaleString("en-IN")}
            </h4>
          </div>
        </>
      )}
    </div>
  );
}

export default AddToCart;
