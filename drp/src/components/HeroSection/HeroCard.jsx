import React from "react";
import "./HeroSection.css";

const HeroCard = ({ dest, isActive }) => {
  return (
    <div className={`hero-card ${isActive ? "active" : ""}`}>
      <img src={dest.cardImage} alt={dest.name} className="hero-card-img" />
      <div className="card-overlay">{dest.name}</div>
    </div>
  );
};

export default HeroCard;
