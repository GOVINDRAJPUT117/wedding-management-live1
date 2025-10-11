import React, { useEffect, useState } from "react";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";
import { useNavigate } from "react-router-dom";

function AdminServices() {
    const [services, setServices] = useState([]);
    //   console.log("services"+JSON.stringify(services))
    const navigate = useNavigate();

    useEffect(() => {
        var user = JSON.parse(localStorage.getItem("userData"));
        var token = user?.token;
        console.log("token==" + token);

        WebServices.getAPIUsingToken(WebAPI.fetchservice, token)
            .then((res) => {
                console.log("Image name from backend: ", res.data);
                setServices(res.data.data);
            })
            .catch((error) => {
                console.error("Error fetching services:", error);
            });
    }, []);

    const handleDelete = async (id) => {
        var user = JSON.parse(localStorage.getItem("userData"));
        var token = user?.token;
        try {
            var result = await WebServices.deleteAPIUsingToken(WebAPI.deleteservice + "/" + id, token)
            console.log("Service Deleted Successfully:", result);

            setServices((prevServices) =>
                prevServices.filter((service) => service._id !== id));
        }
        catch (err) {
            console.error("Error deleting service:", err);
            alert("Failed to delete the service.");
        }
 };
          const handleEdit = (service) => {
            console.log("kya yrr"+service)
          navigate("/addService", { state: service });
                 };

    return (
        <div className="container my-4">
            <h2 className="text-center mb-4">Services Table</h2>

            <div className="table-responsive">
                <table className="table table-bordered table-striped align-middle text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Service Name</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service,index) => (
                            <tr key={service._id}>
                                <td>{index+1}</td>
                                <td>
                                    <img
                                        src={`http://localhost:3000/uploads/${encodeURIComponent(service.service_image)}`}
                                        alt={service.service_name}
                                        style={{ height: "100px", width: "150px", objectFit: "cover" }}
                                    />
                                </td>
                                <td className="text-capitalize">{service.service_name}</td>
                                <td>
                                    {Array.isArray(service.category)
                                        ? service.category.map((cat) => cat.catName).join(", ")
                                        : service.category?.catName}
                                </td>
                                <td>{service.service_description}</td>
                                <td>₹{service.service_price}</td>
                                <td className="text-center" style={{ whiteSpace: "nowrap" }}>
                                    <button
                                        className="btn btn-success me-2"
                                        onClick={() => handleEdit(service)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(service._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminServices;
