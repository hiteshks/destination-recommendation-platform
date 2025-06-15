import React from "react";
import { Link } from "react-router-dom";
import "./SearchResultCard.css";

const SearchResultCard = ({ destination }) => {
  if (!destination) return null;

  const cardImage =
    destination.imageUrl ||
    destination.cardImage ||
    destination.images?.cardImage ||
    "";

  return (
    <Link to={`/destination/${destination.id}`} className="search-card-link">
      <div className="search-card">
        <div
          className="search-card-image"
          style={{ backgroundImage: `url(${cardImage})` }}
        >
          <span className="search-card-price">
            ₹ {destination.price ?? "N/A"}
          </span>
        </div>

        <div className="search-card-body">
          <h3 className="search-card-title">{destination.name}</h3>
          <p className="search-card-description">
            {destination.shortDescription}
          </p>
          <div className="search-card-rating">
            <span>⭐ {destination.rating ?? "5.0"}</span>
            <span className="search-card-reviews">
              {destination.reviews?.length || 0} Reviews
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchResultCard;
