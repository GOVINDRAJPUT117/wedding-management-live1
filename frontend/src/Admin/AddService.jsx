import { useEffect, useState } from "react";
import WebService from "../services/WebServices";
import WebAPI from "../services/WebAPI";
import { useLocation, useNavigate } from "react-router-dom";
import "../pages/auth.css";

function AddService() {
  const [service, setService] = useState({
    service_name: "",
    category: "",
    service_description: "",
    service_price: "",
    service_image: null,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const serviceData = location.state;

  useEffect(() => {
    if (serviceData) {
      setService({
        service_name: serviceData.service_name || "",
        category: serviceData.category?.catName || serviceData.category || "",
        service_description: serviceData.service_description || "",
        service_price: serviceData.service_price || "",
        service_image: null,
      });
    }
  }, [serviceData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setService((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const Add = async (event) => {
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem("userData"));
    const token = user?.token;

    const formData = new FormData();
    formData.append("service_name", service.service_name);
    formData.append("category", service.category);
    formData.append("service_description", service.service_description);
    formData.append("service_price", service.service_price);

    if (service.service_image) {
      formData.append("service_image", service.service_image);
    }

    try {
      if (serviceData) {
        await WebService.updateAPIUsingToken(
          `${WebAPI.updateService}/${serviceData._id}`,
          formData,
          token
        );

        navigate("/Admin");
        alert("Service updated successfully");
      } else {
        await WebService.postAPIUsingToken(
          WebAPI.AddService,
          formData,
          token
        );

        navigate("/Admin");
        alert("Service added successfully");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <h2 className="auth-title">
          {serviceData ? "Update Service" : "Add Service"}
        </h2>

        <p className="auth-subtitle">
          Manage your wedding services
        </p>

        <form onSubmit={Add} encType="multipart/form-data">
          <div className="auth-field">
            <input
              type="text"
              name="service_name"
              placeholder="Service Name"
              value={service.service_name}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <input
              type="text"
              name="category"
              placeholder="Category Name"
              value={service.category}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <input
              type="text"
              name="service_description"
              placeholder="Description"
              value={service.service_description}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <input
              type="number"
              name="service_price"
              placeholder="Price"
              value={service.service_price}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <input
              type="file"
              name="service_image"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="auth-button">
            {serviceData ? "Update Service" : "Add Service"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddService;

