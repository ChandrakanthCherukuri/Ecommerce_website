// src/pages/LoginPage.jsx
import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth(); // Use the login function from context
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate('/'); // Redirect to home on successful login
    } catch (err) {
      setError('Failed to log in: ' + (err.response?.data?.msg || err.message));
    }
    setLoading(false);
  }

  return (
    // Changed overall background to primary-bg
    <div className="flex items-center justify-center min-h-screen bg-primary-bg">
      {/* Changed form container background to secondary-bg, and text color for h2 */}
      <div className="p-8 bg-secondary-bg rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-light-text">Log In</h2>
        {error && <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 px-4 py-3 rounded relative mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {/* Changed label text color to light-text */}
            <label className="block text-light-text text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              ref={emailRef}
              required
              // Input field styling for dark theme: text-light-text, dark-border, lime focus ring
              className="shadow appearance-none border border-dark-border rounded w-full py-2 px-3 text-light-text leading-tight focus:outline-none focus:ring-1 focus:ring-accent-500 bg-primary-bg"
            />
          </div>
          <div className="mb-6">
            {/* Changed label text color to light-text */}
            <label className="block text-light-text text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              ref={passwordRef}
              required
              // Input field styling for dark theme: text-light-text, dark-border, lime focus ring
              className="shadow appearance-none border border-dark-border rounded w-full py-2 px-3 text-light-text mb-3 leading-tight focus:outline-none focus:ring-1 focus:ring-accent-500 bg-primary-bg"
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            // Button colors changed to accent-500 (lime) with black text, hover, and focus ring
            className="bg-accent-500 hover:bg-accent-600 text-black font-bold py-2 px-4 rounded focus:outline-none focus:ring-1 focus:ring-accent-500 focus:ring-opacity-75 w-full transition-colors duration-200"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        <div className="mt-6 text-center text-medium-text"> {/* Adjusted text color */}
          Need an account? <Link to="/signup" className="text-accent-500 hover:underline transition-colors duration-200">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;