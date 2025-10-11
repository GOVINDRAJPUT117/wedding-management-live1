import { useState } from "react";
import "./Home.css";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryServices, setCategoryServices] = useState([]);



  const handleCategoryClick = (catName) => {
    if (selectedCategory === catName) {
      setSelectedCategory("");
      setCategoryServices([]);
    } else {
      setSelectedCategory(catName);
      WebServices.getAPICall(`${WebAPI.withouttokenfetchcategory}/${catName}`)
        .then((res) => {
          const result = res.data?.data || [];
          setCategoryServices(result.slice(0, 3));
        })
        .catch((err) => {
          console.error("Error fetching category services:", err);
          setCategoryServices([]);
        });
    }
  };

  return (
    <div className="home-container">
      {/* Hero */}
      <section
        className="hero"
        style={{
          backgroundImage:
            "url('https://image.wedmegood.com/resized/1900X/uploads/city_bg_image/1/north.jpg')",
        }}
      >
        <div className="overlay">
          <h1>✨ Plan Your Dream Wedding</h1>
          <p>All-in-one wedding service booking platform</p>
        </div>
      </section>

      {/* Top Categories */}
      <section className="section">
        <h2>Top Categories</h2>
        <div className="card-grid">
          <div className="card" onClick={() => handleCategoryClick("photography")}>
            <img src="/assets/rajput/09710ec3acdb317c3825da8633329d06.jpg" alt="Photography"  style={{ width: "300px", height: "300px", objectFit: "cover" }} />
            <h3>Photography</h3>
          </div>
          <div className="card" onClick={() => handleCategoryClick("decoration")}>
            <img src="/assets/rajput/d9349087c85b43d8df8074e7b92ac6b3.jpg" alt="Decoration"  style={{ width: "300px", height: "300px", objectFit: "cover" }} />
            <h3>Decoration</h3>
          </div>
          <div className="card" onClick={() => handleCategoryClick("makeup")}>
            <img
               src="/assets/rajput/22fa314972dcc23e722c60fa726af489.jpg"
                  alt="Makeup"
                   style={{ width: "300px", height: "300px", objectFit: "cover" }}
/>

            <h3>Makeup</h3>
          </div>
        </div>
      </section>

      {/* Category Services */}
      {selectedCategory && categoryServices.length > 0 && (
        <section className="section">
          <h2>Services for {selectedCategory}</h2>
          <div className="card-grid">
            {categoryServices.map((service, index) => (
              <div className="card service-card" key={index}>
                <img
                  src={`/upload/service/${service.service_image}`}
                  alt={service.service_name}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-content">
                  <h3>{service.service_name}</h3>
                  <p>{service.service_description}</p>
                  <span className="price-tag">₹{service.service_price}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

  

      {/* How It Works */}
      <section className="section how-it-works">
        <h2>How It Works</h2>
        <ol>
          <li>📋 Browse Services</li>
          <li>🛒 Book Instantly</li>
          <li>🎉 Enjoy Your Special Day</li>
        </ol>
      </section>
    </div>
  );
};

export default Home;
