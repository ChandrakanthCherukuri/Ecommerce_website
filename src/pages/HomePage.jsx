// src/pages/HomePage.jsx
import React from 'react';
import ImageCarousel from '../components/ImageCarousel';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const carouselImages = [
    // Updated placeholder images to fit the dark & lime theme
    { src: 'https://via.placeholder.com/1200x400/1a1a1a/88ff00?text=Modern+Tech+Deals', alt: 'Modern Tech Deals' },
    { src: 'https://via.placeholder.com/1200x400/2c2c2c/e0e0e0?text=New+Arrivals+Collection', alt: 'New Arrivals' },
    { src: 'https://via.placeholder.com/1200x400/1a1a1a/88ff00?text=Explore+Our+Gadgets', alt: 'Explore Our Gadgets' },
  ];

  return (
    <div className="container mx-auto p-4 py-8">
      {/* Hero Section with Carousel */}
      <section className="mb-12">
        <ImageCarousel images={carouselImages} interval={4000} />
      </section>

      {/* Welcome Message / Call to Action */}
      <section className="text-center mb-12">
        {/* Heading text changed to light-text */}
        <h2 className="text-4xl font-extrabold text-light-text mb-4">Discover Amazing Deals!</h2>
        {/* Paragraph text changed to medium-text */}
        <p className="text-xl text-medium-text mb-6 max-w-2xl mx-auto">
          Explore our wide range of products and find exactly what you need at unbeatable prices.
        </p>
        <Link
          to="/products"
          // Button colors changed to accent-500 (lime) with black text for contrast
          className="inline-block bg-accent-500 hover:bg-accent-600 text-black font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
          Shop All Products
        </Link>
      </section>

      {/* Explore Categories Section */}
      {/* Section background changed to secondary-bg, text colors adjusted */}
      <section className="mb-8 bg-secondary-bg p-8 rounded-lg text-center">
        {/* Heading text changed to accent-500 */}
        <h3 className="text-3xl font-bold text-accent-500 mb-4">Explore Our Categories</h3>
        {/* Paragraph text changed to light-text */}
        <p className="text-lg text-light-text mb-6">Find exactly what you're looking for.</p>
        <div className="flex justify-center space-x-6 flex-wrap">
          {/* Category link button colors changed to accent-500 with black text for consistency */}
          <Link to="/products?category=electronics" className="bg-accent-500 text-black px-6 py-3 rounded-full hover:bg-accent-600 transition duration-300">Electronics</Link>
          <Link to="/products?category=fashion" className="bg-accent-500 text-black px-6 py-3 rounded-full hover:bg-accent-600 transition duration-300">Fashion</Link>
          <Link to="/products?category=home" className="bg-accent-500 text-black px-6 py-3 rounded-full hover:bg-accent-600 transition duration-300">Home & Living</Link>
          {/* Add more categories with the same button styling */}
        </div>
      </section>
    </div>
  );
};

export default HomePage;