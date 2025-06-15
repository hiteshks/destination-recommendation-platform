import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import "./DestinationDetailsPage.css";
import { Calendar, Clock, Tag, ListTree } from "lucide-react";

const DestinationDetailsPage = () => {
  const { id } = useParams();
  const { allDestinations } = useSelector((state) => state.userData);

  const destination = allDestinations.find((dest) => dest.id === id);

  console.log(destination);
  const [bgImageUrl, setBgImageUrl] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0); // instantly jump to top
  }, []);

  useEffect(() => {
    if (destination?.bgImage) {
      const bgImage = destination.bgImage;
      // Check if it's a full URL or a storage path
      if (bgImage.startsWith("http")) {
        setBgImageUrl(bgImage);
      } else {
        const storage = getStorage();
        const imageRef = ref(storage, bgImage);
        getDownloadURL(imageRef)
          .then((url) => setBgImageUrl(url))
          .catch((err) => {
            console.error("Error fetching image URL:", err);
            setBgImageUrl(""); // fallback to none
          });
      }
    }
  }, [destination]);

  if (!destination) {
    return <p className="not-found">Destination not found.</p>;
  }

  const {
    name,
    price,
    rating,
    reviews,
    shortDescription,
    longDescription,
    region,
    duration,
    bestSeason,
    type,
    tags,
    attractions,
    experiences,
    events,
    transport,
  } = destination;

  return (
    <div className="destination-details-page">
      <div
        className="destination-hero-banner"
        style={{
          backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : "none",
        }}
      />

      <div className="destination-header">
        <h1>{name}</h1>
        <p className="destination-meta">
          <span>{region}</span>
          <span>₹{price}</span>
          <span>⭐ {rating}</span>
        </p>
        <p className="destination-short-desc">{shortDescription}</p>
      </div>

      <div className="destination-content">
        <p className="long-description">{longDescription}</p>

        <div className="details-grid">
          <div className="grid-item">
            <div className="icon-title">
              <Calendar size={18} className="icon" />
              <h2>Best Season</h2>
            </div>
            {bestSeason?.map((season, idx) => (
              <p key={idx}>{season}</p>
            ))}
          </div>

          <div className="grid-item">
            <div className="icon-title">
              <Clock size={18} className="icon" />
              <h2>Trip Duration</h2>
            </div>
            {duration?.map((d, idx) => (
              <p key={idx}>{d}</p>
            ))}
          </div>
        </div>

        {[
          { label: "Attractions", data: attractions },
          { label: "Experiences", data: experiences },
          { label: "Events", data: events },
        ].map(
          (section) =>
            section.data?.length > 0 && (
              <div className="section" key={section.label}>
                <h3 className="section-title">{section.label}</h3>
                <div className="readonly-options">
                  {section.data.map((item, idx) => (
                    <div key={idx} className="readonly-option">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )
        )}

        <div className="details-grid">
          <div className="grid-item">
            <div className="icon-title">
              <ListTree size={18} className="icon" />
              <h2>Transport</h2>
            </div>
            <p>
              <strong>Airports:</strong>{" "}
              {transport?.airport?.length
                ? transport.airport.join(", ")
                : "N/A"}
            </p>
            <p>
              <strong>Railway Stations:</strong>{" "}
              {transport?.railwayStations?.length
                ? transport.railwayStations.join(", ")
                : "N/A"}
            </p>
          </div>
        </div>

        {reviews?.length > 0 && (
          <div className="reviews-section">
            <h3 className="reviews-heading">Reviews</h3>
            <div className="reviews-grid">
              {reviews.map((rev, idx) => (
                <div className="review-card" key={idx}>
                  <p className="review-name">{rev.name}</p>
                  <p className="review-text">{rev.review}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationDetailsPage;
