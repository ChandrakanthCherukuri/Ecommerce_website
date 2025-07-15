// src/components/ImageCarousel.jsx
import React, { useState, useEffect } from 'react';

const ImageCarousel = ({ images, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer); // Clean up the timer on component unmount
  }, [images, interval]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (images.length === 0) {
    return (
      <div className="bg-gray-200 flex items-center justify-center h-64 text-gray-600 rounded-lg">
        No images to display
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-xl">
      {/* Carousel Image */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.alt || `Slide ${index + 1}`}
            className="w-full h-96 object-cover flex-shrink-0" // Fixed height, cover image
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-white"
      >
        &#10094; {/* Left arrow */}
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-white"
      >
        &#10095; {/* Right arrow */}
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-white' : 'bg-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-white`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;