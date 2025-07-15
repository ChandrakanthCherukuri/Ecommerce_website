// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage'; // Corrected casing
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import PrivateRoute from './components/PrivateRoute';
import FashionPage from './pages/FashionPage'; // Import FashionPage
import HomeLivingPage from './pages/HomeLivingPage'; // Import HomeLivingPage

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const App = () => {
  return (
    <Router>
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/fashion" element={<FashionPage />} />       {/* New Fashion Route */}
          <Route path="/homeliving" element={<HomeLivingPage />} /> {/* New Home & Living Route */}

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/edit-product/:id" element={<EditProductPage />} />
          </Route>
          {/* Add other routes as needed */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

const AppWrapper = () => (
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
);

export default AppWrapper;