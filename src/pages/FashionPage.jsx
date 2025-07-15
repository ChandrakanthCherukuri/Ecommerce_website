// src/pages/FashionPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Assuming you use cart context

const FashionPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart(); // Destructure addToCart from useCart

  useEffect(() => {
    const fetchFashionProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch products specifically for the 'Fashion' category
        const res = await axios.get('http://localhost:5000/api/products?category=fashion');
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching fashion products:', err);
        setError('Failed to load fashion products. Please try again later.');
        setLoading(false);
      }
    };

    fetchFashionProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent navigating to product details page
    e.stopPropagation(); // Stop event propagation
    addToCart(product, 1); // Add 1 quantity of the product to cart
  };

  if (loading) {
    return <div className="text-center py-8 text-xl">Loading Fashion products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500 text-xl">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Fashion Collection</h1>
      {products.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No fashion products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link to={`/product/${product._id}`} key={product._id} className="block">
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 duration-300 overflow-hidden">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={product.name}
                  className="w-full h-48 object-cover object-center"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 truncate mb-1">{product.name}</h2>
                  <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                  <p className="text-xl font-bold text-gray-900 mb-3">₹{product.price.toFixed(2)}</p>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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

export default FashionPage;