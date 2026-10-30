
import React, { useEffect, useState } from "react";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    const token = user?.token;

    WebServices.getAPIUsingToken(WebAPI.fetchservice, token)
      .then((res) => {
        setServices(res.data.data || []);
      })
      .catch(() => {
        alert("Unable to fetch services. Please try again.");
      });
  }, []);

  const handleDelete = async (id) => {
    const user = JSON.parse(localStorage.getItem("userData"));
    const token = user?.token;

    try {
      await WebServices.deleteAPIUsingToken(
        WebAPI.deleteservice + "/" + id,
        token
      );

      setServices((prevServices) =>
        prevServices.filter((service) => service._id !== id)
      );
    } catch (err) {
      alert("Failed to delete the service.");
    }
  };

  const handleEdit = (service) => {
    navigate("/addService", { state: service });
  };

  return (
    <div
      className="container my-5"
      style={{
        backgroundColor: "#fbf6f1",
        padding: "30px",
        borderRadius: "14px",
      }}
    >
      <h2
        className="text-center mb-3"
        style={{
          color: "#7d263f",
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: "36px",
          fontWeight: "600",
        }}
      >
        Services Management
      </h2>

      <p
        className="text-center mb-4"
        style={{ color: "#786c70", fontSize: "14px" }}
      >
        Manage your wedding services
      </p>

      <div
        className="table-responsive"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #ead9dc",
          boxShadow: "0 5px 20px rgba(125,38,63,0.08)",
        }}
      >
        <table className="table table-hover align-middle text-center mb-0">
          <thead>
            <tr>
              {[
                "ID",
                "Image",
                "Service Name",
                "Category",
                "Description",
                "Price",
                "Action",
              ].map((heading) => (
                <th
                  key={heading}
                  style={{
                    backgroundColor: "#7d263f",
                    color: "#ffffff",
                    padding: "15px 12px",
                    whiteSpace: "nowrap",
                    fontWeight: "600",
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {services.map((service, index) => (
              <tr key={service._id}>
                <td style={{ color: "#786c70" }}>{index + 1}</td>

                <td>
                  <img
                    src={`http://localhost:3000/uploads/${encodeURIComponent(
                      service.service_image
                    )}`}
                    alt={service.service_name}
                    style={{
                      height: "75px",
                      width: "110px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ead9dc",
                    }}
                  />
                </td>

                <td
                  style={{
                    color: "#7d263f",
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {service.service_name}
                </td>

                <td style={{ color: "#786c70" }}>
                  {Array.isArray(service.category)
                    ? service.category.map((cat) => cat.catName).join(", ")
                    : service.category?.catName}
                </td>

                <td
                  style={{
                    color: "#786c70",
                    minWidth: "250px",
                    maxWidth: "300px",
                    lineHeight: "1.5",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {service.service_description}
                </td>

                <td
                  style={{
                    color: "#7d263f",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                  }}
                >
                  ₹{service.service_price}
                </td>

                <td style={{ whiteSpace: "nowrap" }}>
                  <button
                    className="btn btn-sm me-2"
                    style={{
                      backgroundColor: "#b65b72",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "7px 14px",
                      fontWeight: "600",
                    }}
                    onClick={() => handleEdit(service)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm"
                    style={{
                      backgroundColor: "#7d263f",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "7px 14px",
                      fontWeight: "600",
                    }}
                    onClick={() => handleDelete(service._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {services.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-5"
                  style={{ color: "#786c70" }}
                >
                  No services available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
