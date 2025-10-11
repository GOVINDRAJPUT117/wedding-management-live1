import { useEffect, useState } from "react";
import WebService from "../services/WebServices";
import WebAPI from "../services/WebAPI";
import { useLocation } from "react-router-dom";

function AddService() {
  const [service, setService] = useState({
    service_name: "",
    category: "",
    service_description: "",
    service_price: "",
    service_image: null,
  });

  const location = useLocation();
  const serviceData = location.state;
  console.log("service data =", serviceData);

  // Edit Mode -> Pre-fill values
  useEffect(() => {
    if (serviceData) {
      setService({
        service_name: serviceData.service_name || "",
        category: serviceData.category?. catName || serviceData.category || "",
        service_description: serviceData.service_description || "",
        service_price: serviceData.service_price || "",
        service_image: null, // update mode me image optional hai
      });
    }
  }, [serviceData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setService((prev) => ({
      ...prev,
      [name]: files ? files[0] : value, // agar file hai to file le lo
    }));
  };

  const Add = async (event) => {
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem("userData"));
    const token = user?.token;
    console.log("token==", token);

    const formData = new FormData();
    formData.append("service_name", service.service_name);
    formData.append("category", service.category);
    formData.append("service_description", service.service_description);
    formData.append("service_price", service.service_price);
    if (service.service_image) {
      formData.append("service_image", service.service_image);
    }

    try {
      let resp;
      if (serviceData) {
        // Update mode
        console.log("service ID =", serviceData?._id);
        resp = await WebService.updateAPIUsingToken(
          `${WebAPI.updateService}/${serviceData._id}`,
          formData,
          token,
        );
        alert("✅ Service updated successfully");
      } else {
        // Add mode
        resp = await WebService.postAPIUsingToken(
          WebAPI.AddService,
          formData,
          token,
        );
        alert("✅ Service added successfully");
      }

      console.log("Response: ", resp);
    } catch (err) {
      console.error("Upload error: ", err);
    }
  };

  return (
    <div className="container mb-4">
      <center>
        <div style={{ width: "400px", height: "550px" }} className="form-control mt-2">
          <h1 style={{ color: "red", textAlign: "center" }}>Add Service</h1>
          <form onSubmit={Add} encType="multipart/form-data" className="mt-4">
            <input
              type="text"
              name="service_name"
              className="form-control mt-3"
              placeholder="Service Name"
              value={service.service_name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="category"
              className="form-control mt-3"
              placeholder="Category Name"
              value={service.category}
              onChange={handleChange}
            />
            <input
              type="text"
              name="service_description"
              className="form-control mt-3"
              placeholder="Description"
              value={service.service_description}
              onChange={handleChange}
            />
            <input
              type="number"
              name="service_price"
              className="form-control mt-3"
              placeholder="Price"
              value={service.service_price}
              onChange={handleChange}
            />
            <input
              type="file"
              name="service_image"
              className="form-control mt-3"
              onChange={handleChange}
            />
            <input
              type="submit"
              value="Submit"
              className="btn btn-danger mt-4"
            />
          </form>
        </div>
      </center>
    </div>
  );
}

export default AddService;
