import React from "react";
import { useNavigate } from "react-router-dom";
import "./CarouselSection.css";

const DestinationCard = ({
  destination,
  allDestinations = [],
  isRegionCard = false,
}) => {
  const navigate = useNavigate();

  if (!destination) return null;

  const regionMatch = allDestinations.find(
    (dest) =>
      dest.region?.toLowerCase() === destination.region?.toLowerCase() &&
      dest.images?.cardImage
  );

  const cardImage =
    destination.imageUrl ||
    destination.cardImage ||
    destination.images?.cardImage ||
    regionMatch?.cardImage ||
    regionMatch?.images?.cardImage ||
    "";

  const totalRegionReviews =
    allDestinations
      ?.filter(
        (dest) =>
          dest.region?.toLowerCase() === destination.region?.toLowerCase() &&
          Array.isArray(dest.reviews)
      )
      ?.reduce((sum, dest) => sum + dest.reviews.length, 0) || 0;

  const reviewCount =
    totalRegionReviews > 0
      ? totalRegionReviews
      : Array.isArray(destination.reviews)
      ? destination.reviews.length
      : 0;

  const handleClick = () => {
    if (isRegionCard) {
      navigate(`/search?region=${encodeURIComponent(destination.region)}`);
    } else {
      navigate(`/destination/${destination.id}`);
    }
  };

  return (
    <div className="card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <div
        className="card-image"
        style={{
          backgroundImage: `url(${cardImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {destination.price != null && !isRegionCard && (
          <span className="card-price">₹ {destination.price}</span>
        )}
      </div>
      <div className="card-body">
        <h3>{destination.name || "Get Ready to Explore"}</h3>
        {!isRegionCard && (
          <div className="card-rating">
            <span>⭐ {destination.rating || "5.0"}</span>
            <span className="review-count">{reviewCount} Reviews</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationCard;
