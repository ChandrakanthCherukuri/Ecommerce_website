// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 text-center mt-auto"> {/* mt-auto pushes to bottom */}
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} E-Commerce Store. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:text-blue-400 transition duration-300">Privacy Policy</a>
          <span className="text-gray-500">|</span>
          <a href="#" className="hover:text-blue-400 transition duration-300">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;