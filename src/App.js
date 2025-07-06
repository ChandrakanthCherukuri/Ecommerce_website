// src/App.js (excerpt)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Components
import Navbar from './components/Navbar';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import AddProductPage from './pages/AddProductPage';
import CheckoutPage from './pages/CheckoutPage'; // <--- Make sure this is imported

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<RegisterPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />

              {/* Private Routes (requires authentication) */}
              <Route element={<PrivateRoute />}> {/* <--- Ensure this wrapper exists */}
                <Route path="/checkout" element={<CheckoutPage />} /> {/* <--- ADD/VERIFY THIS ROUTE */}
                {/* Add other authenticated routes here */}
              </Route>

              {/* Admin Routes (requires admin role) */}
              <Route element={<AdminRoute />}> {/* <--- Ensure this wrapper exists */}
                <Route path="/add-product" element={<AddProductPage />} />
                {/* Add other admin routes here */}
              </Route>
            </Routes>
          </main>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;