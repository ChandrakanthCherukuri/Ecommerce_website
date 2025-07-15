// src/pages/ProductDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Updated path for AuthContext
import { useCart } from '../context/CartContext'; // Import useCart

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(null);

  const { token, currentUser, loading: authLoading } = useAuth();
  const { addToCart, error: cartError, loading: cartLoading } = useCart();

  const [localMessage, setLocalMessage] = useState('');
  const [isMessageError, setIsMessageError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        setProductLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err.response ? err.response.data : err.message);
        setProductError(err.response?.data?.msg || 'Product not found or failed to load.');
        setProductLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    setLocalMessage('');
    setIsMessageError(false);
    if (product && product._id) {
      const success = await addToCart(product._id, 1);
      if (success) {
        setLocalMessage('Item added to cart!');
        setTimeout(() => setLocalMessage(''), 3000);
      } else {
        setIsMessageError(true);
      }
    }
  };

  if (productLoading || authLoading) {
    // Changed text color to light-text for dark background
    return <div className="text-center mt-8 text-light-text text-xl">Loading product details...</div>;
  }

  if (productError) {
    // Kept red for errors but adjusted shade for dark theme
    return <div className="text-center mt-8 text-red-400 text-xl">{productError}</div>;
  }

  if (!product) {
    // Changed text color to medium-text for dark background
    return <div className="text-center mt-8 text-medium-text text-xl">Product not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Changed background to secondary-bg and increased shadow for depth */}
      <div className="bg-secondary-bg rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 p-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-auto object-contain max-h-96"
          />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            {/* Product name text changed to light-text */}
            <h1 className="text-4xl font-bold mb-4 text-light-text">{product.name}</h1>
            {/* Description text changed to medium-text */}
            <p className="text-medium-text text-lg mb-4">{product.description}</p>
            {/* Price text changed to accent-500 (lime green) */}
            <p className="text-accent-500 text-3xl font-extrabold mb-4">₹{product.price.toFixed(2)}</p>
            {/* Category, Brand, Stock labels changed to medium-text */}
            <p className="text-medium-text text-base mb-2">Category: <span className="font-semibold">{product.category}</span></p>
            <p className="text-medium-text text-base mb-2">Brand: <span className="font-semibold">{product.brand || 'N/A'}</span></p>
            <p className="text-medium-text text-base mb-4">Stock: <span className="font-semibold">{product.stock}</span></p>
          </div>

          {/* Display cart-related messages */}
          {(localMessage || cartError) && (
            <div className={`p-3 mt-4 rounded text-center ${isMessageError || cartError ? 'bg-red-900 bg-opacity-30 text-red-300' : 'bg-green-900 bg-opacity-30 text-green-300'}`}>
              {localMessage || cartError}
            </div>
          )}

          <div className="mt-6">
            {currentUser && (
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || product.stock === 0}
                // Button styles updated for active, disabled (out of stock), and loading states
                className={`w-full px-6 py-3 rounded-md text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-colors duration-200
                          ${product.stock === 0
                            ? 'bg-dark-border text-medium-text cursor-not-allowed' // Darker gray for disabled in dark theme
                            : 'bg-accent-500 text-black hover:bg-accent-600 focus:ring-accent-500'}
                          ${cartLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {cartLoading ? 'Adding...' : (product.stock === 0 ? 'Out of Stock' : 'Add to Cart')}
              </button>
            )}
            {!currentUser && (
              // Login message text changed to medium-text
              <p className="text-sm text-medium-text text-center mt-2">Log in to add to cart.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;