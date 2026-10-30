
import React from "react";
import "./Card.css";

function Card({
  service,
  children,
  extraInfo,
  imageHeight,
  descriptionLimit,
  showCategory = true,
  showDescription = true,
  showPrice = true,
 truncateDescription = true,
}) {
  if (!service) return null;

  const category = Array.isArray(service.category)
    ? service.category
        .map((cat) => cat?.catName)
        .filter(Boolean)
        .join(", ") || "N/A"
    : service.category?.catName || "N/A";

  const imageUrl = service.service_image
    ? `https://wedding-management-backend-9wms.onrender.com/uploads/${encodeURIComponent(
        service.service_image
      )}`
    : "";

  const description = service.service_description || "";
  const limit = descriptionLimit ?? 120;

  return (
    <div className="card h-100 shadow global-service-card">
      <div className="global-card-image-wrapper">
        {imageUrl ? (
          <img
            src={imageUrl}
            className="global-card-image"
            alt={service.service_name || "Wedding service"}
            loading="lazy"
          />
        ) : (
          <div className="global-card-no-image">
            Image not available
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-capitalize">
          {service.service_name}
        </h5>

        {showCategory && (
          <p className="card-text">
            <strong>Category:</strong> {category}
          </p>
        )}

     {showDescription && (
  <p className="card-text global-card-description">
    {description}
  </p>
)}

        {extraInfo}

        {showPrice && (
          <p className="card-text fw-bold text-success">
            Price: ₹{service.service_price}
          </p>
        )}

        {children && (
          <div className="global-card-actions">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
