// import { useState } from "react";
// import "./Home.css";
// import WebServices from "../services/WebServices";
// import WebAPI from "../services/WebAPI";

// const Home = () => {
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [categoryServices, setCategoryServices] = useState([]);



//   const handleCategoryClick = (catName) => {
//     if (selectedCategory === catName) {
//       setSelectedCategory("");
//       setCategoryServices([]);
//     } else {
//       setSelectedCategory(catName);
//       WebServices.getAPICall(`${WebAPI.withouttokenfetchcategory}/${catName}`)
//         .then((res) => {
//           const result = res.data?.data || [];
//           setCategoryServices(result.slice(0, 3));
//         })
//         .catch((err) => {
//           console.error("Error fetching category services:", err);
//           setCategoryServices([]);
//         });
//     }
//   };

//   return (
//     <div className="home-container">
//       {/* Hero */}
//       <section
//         className="hero"
//         style={{
//           backgroundImage:
//             "url('https://image.wedmegood.com/resized/1900X/uploads/city_bg_image/1/north.jpg')",
//         }}
//       >
//         <div className="overlay">
//           <h1>✨ Plan Your Dream Wedding</h1>
//           <p>All-in-one wedding service booking platform</p>
//         </div>
//       </section>

//       {/* Top Categories */}
//       <section className="section">
//         <h2>Top Categories</h2>
//         <div className="card-grid">
//           <div className="card" onClick={() => handleCategoryClick("photography")}>
//             <img src="display_img/5a9c8d78489a0a5ba184847f6de51cd6.jpg" alt="Photography"  style={{ width: "300px", height: "300px", objectFit: "cover" }} />
//             <h3>Photography</h3>
//           </div>
//           <div className="card" onClick={() => handleCategoryClick("decoration")}>
//             <img src="display_img/6eb111f97a89f079b852ae40b3ea2bc7.jpg" alt="Decoration"  style={{ width: "300px", height: "300px", objectFit: "cover" }} />
//             <h3>Decoration</h3>
//           </div>
//           <div className="card" onClick={() => handleCategoryClick("makeup")}>
//             <img
//                src="display_img/9fb67ba9064be86ebba53c3e73bfe35e.jpg"
//                   alt="Makeup"
//                    style={{ width: "300px", height: "300px", objectFit: "cover" }}
// />

//             <h3>Makeup</h3>
//           </div>
//         </div>
//       </section>

//       {/* Category Services */}
//       {/* {selectedCategory && categoryServices.length > 0 && (
//         <section className="section">
//           <h2>Services for {selectedCategory}</h2>
//           <div className="card-grid">
//             {categoryServices.map((service, index) => (
//               <div className="card service-card" key={index}>
//                 <img
//                   src={`/upload/service/${service.service_image}`}
//                   alt={service.service_name}
//                   style={{ height: "250px", objectFit: "cover" }}
//                 />
//                 <div className="card-content">
//                   <h3>{service.service_name}</h3>
//                   <p>{service.service_description}</p>
//                   <span className="price-tag">₹{service.service_price}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       )} */}



//       {/* How It Works */}
//       <section className="section how-it-works">
//         <h2>How It Works</h2>
//         <ol>
//           <li>📋 Browse Services</li>
//           <li>🛒 Book Instantly</li>
//           <li>🎉 Enjoy Your Special Day</li>
//         </ol>
//       </section>
//     </div>
//   );
// };

// export default Home;



import { useState } from "react";
import "./Home.css";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";

const categories = [
  {
    name: "Photography",
    value: "photography",
    image: "/display_img/5a9c8d78489a0a5ba184847f6de51cd6.jpg",
    description: "Capture every beautiful moment",
  },
  {
    name: "Decoration",
    value: "decoration",
    image: "/display_img/6eb111f97a89f079b852ae40b3ea2bc7.jpg",
    description: "Create your dream wedding setup",
  },
  {
    name: "Makeup",
    value: "makeup",
    image: "/display_img/9fb67ba9064be86ebba53c3e73bfe35e.jpg",
    description: "Look your best on your big day",
  },
];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryServices, setCategoryServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCategoryClick = async (catName) => {
    if (selectedCategory === catName) {
      setSelectedCategory("");
      setCategoryServices([]);
      setError("");
      return;
    }

    setSelectedCategory(catName);
    setCategoryServices([]);
    setError("");
    setLoading(true);

    try {
      const res = await WebServices.getAPICall(
        `${WebAPI.withouttokenfetchcategory}/${catName}`
      );

      const result = res.data?.data || [];

      setCategoryServices(result.slice(0, 3));

      if (result.length === 0) {
        setError("Is category mein abhi koi service available nahi hai.");
      }
    } catch (err) {
      console.error("Error fetching category services:", err);
      setError("Services load nahi ho sakin. Please dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  const exploreCategories = () => {
    document.getElementById("wedding-categories")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main className="home-container">
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          backgroundImage:
            "url('/background_img/north.webp')" ,
        }}
      >
        <div className="hero-shade"></div>

        <div className="hero-content">
          <span className="hero-eyebrow">
            YOUR STORY. YOUR CELEBRATION.
          </span>

          <h1>
            Your Dream Wedding,
            <br />
            <span>Beautifully Planned.</span>
          </h1>

          <p>
            Discover wedding services, explore beautiful ideas and make
            your special day unforgettable.
          </p>

          <button className="explore-btn" onClick={exploreCategories}>
            Explore Services <span aria-hidden="true">→</span>
          </button>

          <div className="hero-note">
            <span>♡</span> Every wedding deserves to be special
          </div>
        </div>

        <div className="hero-bottom-label">MADE FOR YOUR BIG DAY</div>
      </section>

      {/* Intro */}
      <section className="welcome-section">
        <span className="section-kicker">LET THE CELEBRATION BEGIN</span>
        <h2>
          Everything for your <span>special day</span>
        </h2>
        <p>
          From picture-perfect moments to stunning decorations, discover
          the services that bring your wedding vision to life.
        </p>
      </section>

      {/* Categories */}
      <section
        className="section categories-section"
        id="wedding-categories"
      >
        <div className="section-heading">
          <div>
            <span className="section-kicker">EXPLORE OUR SERVICES</span>
            <h2>Find Your Perfect Match</h2>
          </div>
          <p>Little details. Beautiful memories. One unforgettable wedding.</p>
        </div>

        <div className="category-grid">
          {categories.map((category, index) => (
            <button
              type="button"
              className={`category-card ${selectedCategory === category.value ? "category-active" : ""
                }`}
              key={category.value}
              onClick={() => handleCategoryClick(category.value)}
              aria-pressed={selectedCategory === category.value}
            >
              <div className="category-image-wrap">
                <img
                  src={category.image}
                  alt={category.name}
                  className="category-image"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                  }}
                />

                <span className="category-number">0{index + 1}</span>
                <span className="category-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>

              <div className="category-info">
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
                <span className="category-open" aria-hidden="true">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Services loaded from existing API */}
      {selectedCategory && (
        <section className="section category-results">
          <div className="section-heading results-heading">
            <div>
              <span className="section-kicker">OUR COLLECTION</span>
              <h2>
                {
                  categories.find(
                    (item) => item.value === selectedCategory
                  )?.name
                }{" "}
                Services
              </h2>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={() => {
                setSelectedCategory("");
                setCategoryServices([]);
                setError("");
              }}
            >
              Close ×
            </button>
          </div>

          {loading && (
            <p className="status-message">Loading services...</p>
          )}

          {!loading && error && (
            <p className="status-message">{error}</p>
          )}

          {!loading && !error && (
            <div className="service-grid">
              {categoryServices.map((service, index) => (
                <article
                  className="home-service-card"
                  key={service._id || service.id || index}
                >

                  <div className="service-image-wrap">
                    <img
                      src={`https://wedding-management-backend-9wms.onrender.com/uploads/${service.service_image}`}
                      alt={service.service_name || "Wedding service"}
                      loading="lazy"
                      onError={(event) => {
                        console.error(
                          "Image failed to load:",
                          event.currentTarget.src
                        );
                      }}
                    />
                  </div>

                  <div className="home-service-content">
                    <h3>{service.service_name}</h3>
                    <p>
                      {service.service_description ||
                        "Make your celebration extra special."}
                    </p>

                    {service.service_price != null && (
                      <div className="service-price">
                        ₹{service.service_price}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* How It Works */}
      <section className="how-section">
        <div className="how-inner">
          <div className="how-heading">
            <span className="section-kicker">SIMPLE & STRESS-FREE</span>
            <h2>
              Your wedding journey, <span>made easier.</span>
            </h2>
            <p>
              A few simple steps to start planning the celebration
              you have always imagined.
            </p>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <div className="step-icon" aria-hidden="true">♡</div>
              <h3>Explore</h3>
              <p>
                Browse wedding service categories and find what you need.
              </p>
            </article>

            <article className="step-card">
              <span className="step-number">02</span>
              <div className="step-icon" aria-hidden="true">✧</div>
              <h3>Choose</h3>
              <p>Discover suitable services for your celebration.</p>
            </article>

            <article className="step-card">
              <span className="step-number">03</span>
              <div className="step-icon" aria-hidden="true">♧</div>
              <h3>Celebrate</h3>
              <p>
                Let your planning come together for your big day.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Closing Banner */}
      <section className="closing-banner">
        <div className="closing-content">
          <span className="section-kicker">YOUR DAY. YOUR DREAM.</span>
          <h2>
            Let's make it <span>unforgettable.</span>
          </h2>
          <p>
            Your perfect celebration begins with the right services.
          </p>

          <button
            className="explore-btn closing-btn"
            onClick={exploreCategories}
          >
            Start Exploring <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </main>
  );
};

export default Home;
