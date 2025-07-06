// src/pages/EditProductPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:5000/api/products';

const EditProductPage = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const { token, currentUser, loading: authLoading, logout } = useAuth(); // Destructure loading from useAuth

  // State to hold form data, initialized as empty
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    stock: '',
    brand: ''
  });

  const [loading, setLoading] = useState(true); // For product data fetching
  const [error, setError] = useState(null); // For product data fetching errors
  const [message, setMessage] = useState(''); // For submission success/error messages
  const [isError, setIsError] = useState(false);

  // Destructure formData for easier access
  const { name, description, price, imageUrl, category, stock, brand } = formData;

  // useEffect to fetch product data when component mounts or ID changes
  useEffect(() => {
    const fetchProduct = async () => {
      // Check for admin role before fetching data
      if (!authLoading && (!currentUser || currentUser.role !== 'admin')) {
          setError('Access Denied: Admin privileges required to edit products.');
          setLoading(false);
          logout();
          navigate('/login');
          return;
      }
      if (!token) { // If no token after auth is loaded, redirect
          setLoading(false);
          return;
      }

      try {
        const config = {
          headers: {
            'x-auth-token': token // Send token to authorize fetching
          }
        };
        const res = await axios.get(`${API_BASE_URL}/${id}`, config);
        // Pre-fill the form with fetched product data
        setFormData({
          name: res.data.name,
          description: res.data.description,
          price: res.data.price,
          imageUrl: res.data.imageUrl,
          category: res.data.category,
          stock: res.data.stock,
          brand: res.data.brand || '' // Handle optional brand field
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product for edit:', err.response ? err.response.data : err.message);
        setError(err.response?.data?.msg || 'Failed to load product for editing.');
        setLoading(false);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            logout();
            navigate('/login');
        } else if (err.response && err.response.status === 404) {
            setError('Product not found.');
        }
      }
    };

    if (id && !authLoading) { // Fetch only if ID is present and auth is done loading
        fetchProduct();
    }
  }, [id, token, currentUser, authLoading, navigate, logout]); // Add dependencies

  // Handle input changes
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (PUT request)
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!token || !currentUser || currentUser.role !== 'admin') {
        setMessage('You are not authorized to edit products.');
        setIsError(true);
        logout();
        navigate('/login');
        return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const res = await axios.put(`${API_BASE_URL}/${id}`, formData, config);
      setMessage(res.data.msg || 'Product updated successfully!');
      setIsError(false);
      // Optionally, redirect to products page after successful update
      // navigate('/products');

    } catch (err) {
      console.error('Error updating product:', err.response ? err.response.data : err.message);
      setIsError(true);
      setMessage(err.response && err.response.data && err.response.data.msg
                  ? err.response.data.msg
                  : 'Failed to update product. Server error.');

      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setMessage(err.response.data.msg || 'Authentication required or not authorized.');
          logout();
          navigate('/login');
      }
    }
  };

  if (authLoading || loading) {
    return <div className="text-center mt-8 text-xl">Loading product data...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500 text-xl">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold text-center mb-8">Edit Product</h1>

      {message && (
        <div className={`p-3 mb-4 rounded ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            rows="4"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={onChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={imageUrl}
            onChange={onChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={category}
            onChange={onChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="stock" className="block text-gray-700 text-sm font-bold mb-2">Stock:</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={stock}
            onChange={onChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            min="0"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="brand" className="block text-gray-700 text-sm font-bold mb-2">Brand (Optional):</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={brand}
            onChange={onChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;