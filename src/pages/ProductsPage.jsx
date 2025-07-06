// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Import useCart

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentUser, token, loading: authLoading } = useAuth();
  const { addToCart, error: cartError, loading: cartLoading } = useCart(); // Get addToCart and cart status

  const [localMessage, setLocalMessage] = useState(''); // For local success/error messages
  const [isMessageError, setIsMessageError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err.response ? err.response.data : err.message);
        setError('Failed to fetch products.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    if (!token) {
      alert('You must be logged in to delete products.');
      return;
    }
    if (currentUser.role !== 'admin') {
      alert('You do not have permission to delete products.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        await axios.delete(`http://localhost:5000/api/products/${productId}`, config);
        setProducts(products.filter((product) => product._id !== productId));
        alert('Product deleted successfully!');
      } catch (err) {
        console.error('Error deleting product:', err.response ? err.response.data : err.message);
        alert(err.response?.data?.msg || 'Failed to delete product.');
      }
    }
  };

  // Handle Add to Cart button click
  const handleAddToCart = async (productId) => {
    setLocalMessage(''); // Clear previous message
    setIsMessageError(false);
    const success = await addToCart(productId, 1); // Add 1 quantity by default
    if (success) {
      setLocalMessage('Item added to cart!');
      setTimeout(() => setLocalMessage(''), 3000); // Clear message after 3 seconds
    } else {
      setIsMessageError(true);
      // cartError is already set by useCart, so it will be displayed
    }
  };

  if (loading) {
    return <div className="text-center mt-8 text-xl">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500 text-xl">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>

      {/* Display cart-related messages */}
      {(localMessage || cartError) && (
        <div className={`p-3 mb-4 rounded text-center ${isMessageError || cartError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {localMessage || cartError}
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No products available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg flex flex-col">
              <Link to={`/product/${product._id}`} className="block"> {/* Make image and name clickable */}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex-grow">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 hover:text-blue-600 transition duration-300">{product.name}</h2>
                </div>
              </Link>
              <div className="p-4 border-t border-gray-200 flex flex-col">
                <p className="text-gray-700 text-lg font-bold mb-2">${product.price.toFixed(2)}</p>
                <p className="text-gray-600 text-sm mb-4">Stock: {product.stock}</p>
                
                {currentUser && ( // Only show "Add to Cart" if a user is logged in
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={cartLoading || product.stock === 0} // Disable if adding or out of stock
                    className={`mt-auto w-full px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-opacity-75
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

                {/* Admin specific buttons */}
                {currentUser && currentUser.role === 'admin' && (
                  <div className="mt-4 flex space-x-2">
                    <Link
                      to={`/edit-product/${product._id}`}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-center py-2 px-3 rounded text-sm transition-colors duration-200"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;