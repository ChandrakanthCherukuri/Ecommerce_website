// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Make sure this import is there

function Navbar() {
  const { currentUser, logout } = useAuth();
  const { cartItems } = useCart(); // <-- ADD THIS LINE: Get cartItems from useCart()
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">E-Commerce</Link>
      <div>
        <Link to="/products" className="mr-4 hover:text-gray-300">Products</Link>
        <Link to="/cart" className="hover:text-gray-300 relative">
          Cart
          {cartItems.length > 0 && ( // This will now correctly access cartItems
            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Link>
        
        {currentUser && currentUser.role === 'admin' && ( // Only show if admin
          <Link to="/add-product" className="mr-4 hover:text-gray-300">Add Product</Link>
        )}
        {currentUser ? (
          <>
            <span className="mr-4">Welcome, {currentUser.email}!</span>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:text-gray-300">Login</Link>
            <Link to="/signup" className="hover:text-gray-300">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;