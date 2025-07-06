// src/pages/HomePage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth to show current user

function HomePage() {
  const { currentUser } = useAuth(); // Access current user from context

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to Your E-commerce Store!</h1>
      {currentUser && (
        <p className="text-xl text-gray-700">You are logged in as: <span className="font-semibold">{currentUser.email}</span></p>
      )}
      {!currentUser && (
        <p className="text-xl text-gray-700">Please log in or sign up.</p>
      )}
      <p className="mt-8 text-lg text-gray-600">This is your protected home page.</p>
    </div>
  );
}

export default HomePage;