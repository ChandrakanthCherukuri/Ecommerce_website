// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { cartItems } = useCart();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    // Navbar background changed to secondary-bg, shadow for depth
    <nav className="bg-secondary-bg shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo/Brand Name */}
        {/* Text color changed to light-text, hover to accent-500 (bright lime) */}
        <Link to="/" className="text-2xl font-bold text-light-text hover:text-accent-500 transition duration-300">
          Zenbu
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {/* Link text changed to medium-text, hover to accent-500 (bright lime) */}
          <Link to="/products" className="text-medium-text hover:text-accent-500 font-medium transition duration-300">
            Electronics
          </Link>
          {/* Updated Category Links to new pages */}
          <Link
            to="/fashion" // Changed to new dedicated route
            className="text-medium-text hover:text-accent-500 font-medium transition duration-300"
          >
            Fashion
          </Link>
          <Link
            to="/homeliving" // Changed to new dedicated route
            className="text-medium-text hover:text-accent-500 font-medium transition duration-300"
          >
            Home & Living
          </Link>

          {/* Cart link with item count bubble */}
          <Link to="/cart" className="relative text-medium-text hover:text-accent-500 font-medium transition duration-300">
            Cart
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-400 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </Link>
        </div>

        {/* Auth Links / User Info */}
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              {/* Conditionally render Add Product link only for admins */}
              {currentUser.role === 'admin' && (
                <Link
                  to="/add-product"
                  className="text-accent-500 hover:text-accent-600 font-medium transition duration-300"
                >
                  Add Product
                </Link>
              )}
              {/* Welcome text changed to light-text */}
              <span className="text-light-text">Welcome, {currentUser.username || 'User'}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login link text changed to medium-text, hover to accent-500 */}
              <Link
                to="/login"
                className="text-medium-text hover:text-accent-500 font-medium transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                // Sign Up button background changed to accent-500 (lime), hover to accent-600, text to black
                className="bg-accent-500 hover:bg-accent-600 text-black font-semibold py-2 px-4 rounded-md transition duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;