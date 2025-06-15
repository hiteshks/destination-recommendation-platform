import React, { useRef, useState, useEffect } from "react";
import DestinationCarousel from "./DestinationCarousel";
import "./CarouselSection.css";

const CarouselSection = ({ title, data, allDestinations }) => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    const container = carouselRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft + container.offsetWidth < container.scrollWidth
      );
    }
  };

  const scroll = (direction) => {
    const container = carouselRef.current;
    if (!container) return;
    const scrollAmount = direction === "left" ? -1120 : 1120;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;
    updateScrollButtons();
    container.addEventListener("scroll", updateScrollButtons);
    return () => container.removeEventListener("scroll", updateScrollButtons);
  }, [data]);

  return (
    <div className="destination-section">
      <div className="destination-header-row">
        <h2 className="heading">{title}</h2>
        <div className="carousel-controls">
          <button
            className="nav-button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          >
            &lt;
          </button>
          <button
            className="nav-button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          >
            &gt;
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="empty-section">
          No destinations match this preference yet.
        </div>
      ) : (
        <DestinationCarousel
          ref={carouselRef}
          data={data}
          allDestinations={allDestinations}
        />
      )}
    </div>
  );
};

export default CarouselSection;
