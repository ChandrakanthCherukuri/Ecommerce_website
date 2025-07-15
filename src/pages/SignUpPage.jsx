// src/pages/SignUpPage.jsx
import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Corrected path for AuthContext based on common structure
import { Link, useNavigate } from 'react-router-dom';

function SignUpPage() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth(); // Use the signup function from context
  const [error, setError] = useState(''); // This state is used for password mismatch or direct signup errors
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      // If signup is successful, AuthContext might handle setting the token and user.
      // You might want a success message here before redirecting.
      // For now, just redirect:
      navigate('/'); // Redirect to home on successful signup
    } catch (err) {
      // err.response.data.msg will contain the backend error message if available
      setError('Failed to create an account: ' + (err.response?.data?.msg || err.message));
    }
    setLoading(false);
  }

  return (
    // Changed overall background to primary-bg
    <div className="flex items-center justify-center min-h-screen bg-primary-bg">
      {/* Changed form container background to secondary-bg, and increased shadow */}
      <div className="p-8 bg-secondary-bg rounded-lg shadow-xl w-full max-w-md">
        {/* Heading text changed to light-text */}
        <h2 className="text-3xl font-bold mb-6 text-center text-light-text">Sign Up</h2>
        {/* Error message styling for dark theme */}
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
              // Input field styling for dark theme: text-light-text, dark-border, lime focus ring, primary-bg for input background
              className="shadow appearance-none border border-dark-border rounded w-full py-2 px-3 text-light-text leading-tight focus:outline-none focus:ring-1 focus:ring-accent-500 bg-primary-bg"
            />
          </div>
          <div className="mb-4">
            {/* Changed label text color to light-text */}
            <label className="block text-light-text text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              ref={passwordRef}
              required
              // Input field styling for dark theme
              className="shadow appearance-none border border-dark-border rounded w-full py-2 px-3 text-light-text mb-3 leading-tight focus:outline-none focus:ring-1 focus:ring-accent-500 bg-primary-bg"
            />
          </div>
          <div className="mb-6">
            {/* Changed label text color to light-text */}
            <label className="block text-light-text text-sm font-bold mb-2" htmlFor="password-confirm">
              Password Confirmation
            </label>
            <input
              type="password"
              id="password-confirm"
              ref={passwordConfirmRef}
              required
              // Input field styling for dark theme
              className="shadow appearance-none border border-dark-border rounded w-full py-2 px-3 text-light-text leading-tight focus:outline-none focus:ring-1 focus:ring-accent-500 bg-primary-bg"
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            // Button colors changed to accent-500 (lime) with black text, hover, and focus ring
            className="bg-accent-500 hover:bg-accent-600 text-black font-bold py-2 px-4 rounded focus:outline-none focus:ring-1 focus:ring-accent-500 focus:ring-opacity-75 w-full transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        {/* "Already have an account?" text changed to medium-text, Login link to accent-500 */}
        <div className="mt-6 text-center text-medium-text">
          Already have an account? <Link to="/login" className="text-accent-500 hover:text-accent-600 transition-colors duration-200">Log In</Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;