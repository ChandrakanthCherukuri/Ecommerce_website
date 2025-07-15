// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth/AuthContext'; // Corrected path for AuthContext based on common structure

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const [localMessage, setLocalMessage] = useState(''); // Renamed to avoid direct conflict with auth.error
  const [isMessageError, setIsMessageError] = useState(false); // To control message styling (success/error)
  const { register, error: authError, loading } = useAuth(); // Renamed context error to authError
  const navigate = useNavigate();

  const { name, email, password, password2 } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalMessage(''); // Clear previous messages
    setIsMessageError(false); // Reset message type

    if (password !== password2) {
      setLocalMessage('Passwords do not match');
      setIsMessageError(true);
      return; // Stop form submission
    }

    try {
      await register({ name, email, password });
      setLocalMessage('Registration successful! Please log in.');
      setIsMessageError(false); // Mark as a success message
      // Optionally redirect after successful registration
      navigate('/login');
    } catch (err) {
      // AuthContext's error will be available via `authError` state.
      // Prioritize authError if available, otherwise fallback to generic.
      setLocalMessage(authError || 'Registration failed');
      setIsMessageError(true); // Mark as an error message
    }
  };

  return (
    // Assuming a parent component or App.js handles the primary-bg for the overall page
    <div className="container mx-auto p-4 max-w-md mt-10">
      {/* Heading text changed to light-text for dark background */}
      <h1 className="text-3xl font-bold text-center mb-6 text-light-text">Sign Up</h1>
      {/* Form background changed from white to secondary-bg and increased shadow for depth */}
      <form onSubmit={onSubmit} className="bg-secondary-bg p-8 rounded-lg shadow-xl">
        <div className="mb-4">
          {/* Label text changed to light-text */}
          <label className="block text-light-text text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            // Input field styling for dark theme: text-light-text, dark-border, lime focus ring, primary-bg for input background
            className="shadow appearance-none border border-dark-border rounded w-full py-2 px-3 text-light-text leading-tight focus:outline-none focus:ring-1 focus:ring-accent-500 bg-primary-bg"
            required
          />
        </div>
        <div className="mb-4">
          {/* Label text changed to light-text */}
          <label className="block text-light-text text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            // Input field styling for dark theme
            className="shadow appearance-none border border-dark-border rounded w-full py-2 px-3 text-light-text leading-tight focus:outline-none focus:ring-1 focus:ring-accent-500 bg-primary-bg"
            required
          />
        </div>
        <div className="mb-4">
          {/* Label text changed to light-text */}
          <label className="block text-light-text text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            // Input field styling for dark theme
            className="shadow appearance-none border border-dark-border rounded w-full py-2 px-3 text-light-text mb-3 leading-tight focus:outline-none focus:ring-1 focus:ring-accent-500 bg-primary-bg"
            minLength="6"
            required
          />
        </div>
        <div className="mb-6">
          {/* Label text changed to light-text */}
          <label className="block text-light-text text-sm font-bold mb-2" htmlFor="password2">
            Confirm Password
          </label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            onChange={onChange}
            // Input field styling for dark theme
            className="shadow appearance-none border border-dark-border rounded w-full py-2 px-3 text-light-text mb-3 leading-tight focus:outline-none focus:ring-1 focus:ring-accent-500 bg-primary-bg"
            minLength="6"
            required
          />
        </div>
        {/* Conditional message display based on isMessageError state */}
        {localMessage && (
          <p className={`text-center mb-4 ${isMessageError ? 'text-red-400' : 'text-green-400'}`}>
            {localMessage}
          </p>
        )}
        {/* Display authError only if no localMessage is currently being shown (to prevent double messages) */}
        {authError && !localMessage && (
            <p className="text-red-400 text-center mb-4">{authError}</p>
        )}
        <button
          type="submit"
          // Button colors changed to accent-500 (lime) with black text, hover, and focus ring
          className="bg-accent-500 hover:bg-accent-600 text-black font-bold py-2 px-4 rounded focus:outline-none focus:ring-1 focus:ring-accent-500 focus:ring-opacity-75 w-full transition-colors duration-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {/* "Already have an account?" text changed to medium-text, Login link to accent-500 */}
      <p className="text-center text-medium-text text-sm mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-accent-500 hover:text-accent-600 transition-colors duration-200">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;