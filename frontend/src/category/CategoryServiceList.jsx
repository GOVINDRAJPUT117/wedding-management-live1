import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";

const CategoryServiceList = () => {
  const { name } = useParams();
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  console.log("name=" + name);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    const token = user?.token;
    console.log("token=" + token);

    WebServices.getAPIUsingToken(
      `${WebAPI.fetchcategory}/${encodeURIComponent(name)}`,
      token
    )
      .then((res) => {
        setServices(res.data.data);
      })
      .catch((err) => {
        setError("");
      });
  }, [name]);

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">
        Services for: <span className="text-primary">{name}</span>
      </h2>
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row">
        {services.map((service) => (
          <div className="col-md-4 mb-4" key={service._id}>
            <div className="card h-100 shadow-sm">
              <img
               
                 src={`http://localhost:3000/uploads/${encodeURIComponent(service.service_image)}`}
                className="card-img-top"
                alt={service.service_name}
                style={{ height: "400px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-capitalize">Service Name:{service.service_name}</h5>
                <p className="card-text">
                {service.service_description.length > 100
                    ? service.service_description.slice(0, 100) + "..."
                    : service.service_description}
                </p>
                <div className="mt-auto">
                  <h6 className="text-success">Price=₹{service.service_price}</h6>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryServiceList;
