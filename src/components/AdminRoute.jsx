// src/components/AdminRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming useAuth provides user and isAuthenticated

const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>; // Or a spinner
  }

  // Check if authenticated and user role is 'admin'
  if (isAuthenticated && user && user.role === 'admin') {
    return <Outlet />; // Render child routes
  } else if (isAuthenticated && user && user.role !== 'admin') {
    // Logged in but not admin, redirect to home or unauthorized page
    return <Navigate to="/" replace />; // Or '/unauthorized'
  } else {
    // Not logged in, redirect to login page (keeping original logic for PrivateRoute)
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;