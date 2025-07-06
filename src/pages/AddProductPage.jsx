// src/pages/AddProductPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // To get the auth token

const API_BASE_URL = 'http://localhost:5000/api/products'; // Your backend products API

const AddProductPage = () => {
  const { token, currentUser, logout, loading } = useAuth(); // Get token and currentUser from AuthContext
  const navigate = useNavigate();

  // State to hold form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    stock: '',
    brand: ''
  });

  const [message, setMessage] = useState(''); // For success or error messages
  const [isError, setIsError] = useState(false);

  // Destructure formData for easier access
  const { name, description, price, imageUrl, category, stock, brand } = formData;

  // Handle input changes
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Basic client-side validation
    if (!name || !description || !price || !imageUrl || !category || !stock) {
        setMessage('Please fill in all required fields.');
        setIsError(true);
        return;
    }

    // Check if user is logged in and has admin role
    if (!token || !currentUser || currentUser.role !== 'admin') {
        setMessage('You are not authorized to add products. Please log in as an admin.');
        setIsError(true);
        logout(); // Optionally log out unauthorized users
        navigate('/login');
        return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token // Send the JWT token in the header
        }
      };

      const res = await axios.post(API_BASE_URL, formData, config);
      setMessage(res.data.msg || 'Product added successfully!');
      setIsError(false);
      setFormData({ // Clear form after successful submission
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: '',
        stock: '',
        brand: ''
      });
      // Optionally, redirect to products page or show a success alert
      // navigate('/products');

    } catch (err) {
      console.error('Error adding product:', err.response ? err.response.data : err.message);
      setIsError(true);
      setMessage(err.response && err.response.data && err.response.data.msg
                  ? err.response.data.msg
                  : 'Failed to add product. Server error.');

      // If token is invalid or unauthorized (e.g., 401, 403 status), log out
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setMessage(err.response.data.msg || 'Authentication required or not authorized.');
          logout();
          navigate('/login');
      }
    }
  };

  // Redirect if not logged in or not admin
  if (!loading && (!currentUser || currentUser.role !== 'admin')) {
    // You might want a more user-friendly redirect here
    navigate('/'); // Redirect to home or login if not admin
    // Or simply render a message:
    // return <div className="text-center mt-8 text-red-500 text-xl">Access Denied: Admin privileges required.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold text-center mb-8">Add New Product</h1>

      {/* Message display */}
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
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;