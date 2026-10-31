
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";
import { useCart } from "../pages/CartContext";
import Card from "../card/Card";
import "./Service.css";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const { refreshCart } = useCart();
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
      await WebServices.postAPIUsingToken(
        WebAPI.booknow,
        bookingData,
        token
      );

      await refreshCart();

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
