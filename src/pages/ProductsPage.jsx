// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Assuming you use cart context

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart(); // Destructure addToCart from useCart

  useEffect(() => {
    const fetchElectronicsProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // API call specifically for 'electronics' category
        const res = await axios.get('http://localhost:5000/api/products?category=electronics');
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching electronics products:', err);
        setError('Failed to load electronics products. Please try again later.');
        setLoading(false);
      }
    };

    fetchElectronicsProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent navigating to product details page
    e.stopPropagation(); // Stop event propagation
    addToCart(product, 1); // Add 1 quantity of the product to cart
  };

  if (loading) {
    // Changed text color to light-text for dark background
    return <div className="text-center py-8 text-light-text text-xl">Loading Electronics products...</div>;
  }

  if (error) {
    // Error text color adjusted for better visibility on dark background
    return <div className="text-center py-8 text-red-400 text-xl">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 py-8">
      {/* Main heading text changed to light-text for dark background */}
      <h1 className="text-4xl font-extrabold text-light-text mb-8 text-center">Our Electronics Collection</h1>
      {products.length === 0 ? (
        // "No products found" text changed to medium-text for dark background
        <p className="text-center text-medium-text text-lg">No electronics products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link to={`/product/${product._id}`} key={product._id} className="block">
              {/* Product card background changed from white to secondary-bg */}
              <div className="bg-secondary-bg rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 duration-300 overflow-hidden">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={product.name}
                  className="w-full h-48 object-cover object-center"
                />
                <div className="p-4">
                  {/* Product title text changed to light-text */}
                  <h2 className="text-lg font-semibold text-light-text truncate mb-1">{product.name}</h2>
                  {/* Product category text changed to medium-text */}
                  <p className="text-medium-text text-sm mb-2">{product.category}</p>
                  {/* Product price text changed to accent-500 (lime green) */}
                  <p className="text-xl font-bold text-accent-500 mb-3">₹{product.price.toFixed(2)}</p>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    // Button background changed to accent-500, text to black for contrast
                    // Hover effect changed to accent-600, focus ring to accent-500
                    className="w-full bg-accent-500 text-black py-2 px-4 rounded-md text-sm font-medium hover:bg-accent-600 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-opacity-50"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;