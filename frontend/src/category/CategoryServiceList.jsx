import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";
import Card from "../card/Card";

function CategoryServiceList() {
  const { name } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoryServices = async () => {
      setLoading(true);
      setError("");

      try {
        const userData = JSON.parse(
          localStorage.getItem("userData") || "null"
        );

        const token = userData?.token;

        const res = await WebServices.getAPIUsingToken(
          `${WebAPI.fetchcategory}/${encodeURIComponent(name)}`,
          token
        );

        setServices(res.data.data || []);
      } catch (err) {
        setError("Unable to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryServices();
  }, [name]);

  return (
    <div className="container my-4">
      <h2
        className="text-center mb-4"
        style={{
          color: "#7d263f",
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: "38px",
          fontWeight: "600",
          textTransform: "capitalize",
          letterSpacing: "0.5px",
        }}
      >
        {name}
      </h2>

      {loading ? (
        <p className="text-center">Loading services...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : services.length === 0 ? (
        <p className="text-center">
          No services available for this category.
        </p>
      ) : (
        <div className="row g-4">
          {services.map((service) => (
            <div
              className="col-12 col-sm-6 col-lg-4"
              key={service._id}
            >
              <Card
                service={service}
                showCategory={false}
                showDescription={true}
                showPrice={true}
                descriptionLimit={100}
                imageHeight="400px"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryServiceList;

