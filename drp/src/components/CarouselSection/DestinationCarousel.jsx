import React, { forwardRef } from "react";
import DestinationCard from "./DestinationCard";
import "./CarouselSection.css";

const DestinationCarousel = forwardRef(({ data, allDestinations }, ref) => {
  return (
    <div className="carousel-wrapper">
      <div className="carousel" ref={ref}>
        {data?.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            allDestinations={allDestinations}
          />
        ))}
      </div>
    </div>
  );
});

export default DestinationCarousel;
