import React, { useEffect, useState, useRef } from "react";
import "./HeroSection.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";

const CARD_WIDTH = 300;
const GAP = 48;

const HeroSection = () => {
  const [destinations, setDestinations] = useState([]);
  const [carouselData, setCarouselData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      const querySnapshot = await getDocs(
        collection(db, "destinations", "heroDestinations", "destinations")
      );
      const data = querySnapshot.docs.map((doc) => doc.data());

      if (data.length > 0) {
        setDestinations(data);
        setCarouselData([...data, data[0]]); // Clone first for circular
      }
    };

    fetchDestinations();
  }, []);

  useEffect(() => {
    if (carouselData.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIndex = prev + 1;

        if (nextIndex === carouselData.length) {
          // Delay reset after animation completes
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition = "none";
              setActiveIndex(0);

              // Force reflow to reset transition
              void carouselRef.current.offsetHeight;
              carouselRef.current.style.transition =
                "transform 0.8s ease-in-out";
            }
          }, 800);
        }

        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselData]);

  if (destinations.length === 0) return null;

  const realIndex =
    destinations.length > 0 && activeIndex >= destinations.length
      ? 0
      : activeIndex;

  const activePlace = destinations.length > 0 ? destinations[realIndex] : null;

  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: activePlace?.bgImage
          ? `url(${activePlace.bgImage})`
          : "none",
      }}
    >
      <div className="hero-overlay">
        <div className="hero-left">
          <h1 className="hero-title">{activePlace.name.toUpperCase()}</h1>
          <p className="hero-description">{activePlace.shortDescription}</p>
          <button className="hero-button">Explore</button>
        </div>

        <div className="hero-right">
          <div className="card-carousel-wrapper">
            <div
              className="card-carousel-sliding"
              ref={carouselRef}
              style={{
                transform: `translateX(-${activeIndex * (CARD_WIDTH + GAP)}px)`,
              }}
            >
              {carouselData.map((place, index) => (
                <div
                  key={index}
                  className={`hero-card ${index === realIndex ? "active" : ""}`}
                  style={{
                    backgroundImage: `url(${place.cardImage})`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
