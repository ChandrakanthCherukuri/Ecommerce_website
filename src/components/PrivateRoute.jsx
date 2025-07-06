// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming useAuth provides isAuthenticated and loading

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth(); // Get authentication state from your AuthContext

  // --- Crucial Debugging Logs ---
  console.log('PrivateRoute: isAuthenticated', isAuthenticated);
  console.log('PrivateRoute: loading', loading);
  // -----------------------------

  // If still loading authentication status, show a loading message
  if (loading) {
    return <div className="text-center mt-8 text-xl">Loading authentication...</div>; // Or a nice spinner
  }

  // If authenticated, render the child routes (e.g., CheckoutPage)
  // Otherwise, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;