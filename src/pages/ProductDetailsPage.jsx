// src/pages/ProductDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Import useCart

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null); // Will directly hold the product object
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(null);

  const { token, currentUser, loading: authLoading } = useAuth();
  const { addToCart, error: cartError, loading: cartLoading } = useCart(); // Get addToCart and cart status

  const [localMessage, setLocalMessage] = useState(''); // For local success/error messages
  const [isMessageError, setIsMessageError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data); // res.data should be the product object directly
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

  // Handle Add to Cart button click
  const handleAddToCart = async () => {
    setLocalMessage(''); // Clear previous message
    setIsMessageError(false);
    // Now access product._id directly, not product.data._id
    if (product && product._id) {
      const success = await addToCart(product._id, 1); // Add 1 quantity by default
      if (success) {
        setLocalMessage('Item added to cart!');
        setTimeout(() => setLocalMessage(''), 3000); // Clear message after 3 seconds
      } else {
        setIsMessageError(true);
      }
    }
  };

  if (productLoading || authLoading) {
    return <div className="text-center mt-8 text-xl">Loading product details...</div>;
  }

  if (productError) {
    return <div className="text-center mt-8 text-red-500 text-xl">{productError}</div>;
  }

  // Ensure product exists before rendering (removed .data check)
  if (!product) {
    return <div className="text-center mt-8 text-gray-500 text-xl">Product not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 p-4">
          {/* Access product.imageUrl directly */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-auto object-contain max-h-96"
          />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            {/* Access product.name, product.description, etc. directly */}
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{product.name}</h1>
            <p className="text-gray-700 text-lg mb-4">{product.description}</p>
            <p className="text-blue-600 text-3xl font-extrabold mb-4">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 text-base mb-2">Category: <span className="font-semibold">{product.category}</span></p>
            <p className="text-gray-600 text-base mb-2">Brand: <span className="font-semibold">{product.brand || 'N/A'}</span></p>
            <p className="text-gray-600 text-base mb-4">Stock: <span className="font-semibold">{product.stock}</span></p>
          </div>

          {/* Display cart-related messages */}
          {(localMessage || cartError) && (
            <div className={`p-3 mt-4 rounded text-center ${isMessageError || cartError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {localMessage || cartError}
            </div>
          )}

          <div className="mt-6"> {/* Buttons section */}
            {currentUser && ( // Only show button if user is logged in
              <button
                onClick={handleAddToCart}
                // Access product.stock directly
                disabled={cartLoading || product.stock === 0} // Disable if adding or out of stock
                className={`w-full px-6 py-3 rounded-md text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-opacity-75
                            ${product.stock === 0
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'}
                            ${cartLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {cartLoading ? 'Adding...' : (product.stock === 0 ? 'Out of Stock' : 'Add to Cart')}
              </button>
            )}
            {!currentUser && (
              <p className="text-sm text-gray-500 text-center mt-2">Log in to add to cart.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;