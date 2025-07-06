// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // To get the token for authenticated requests

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, currentUser, loading: authLoading } = useAuth(); // Get token and currentUser from AuthContext

  // Fetch the user's cart from the backend
  const fetchCart = useCallback(async () => {
    if (!token) {
      setCartItems([]); // Clear cart if no token (user logged out)
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const res = await axios.get('http://localhost:5000/api/cart', config);
      setCartItems(res.data.items || []); // Ensure it's an array, even if cart is empty
    } catch (err) {
      console.error('Error fetching cart:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.msg || 'Failed to fetch cart.');
      setCartItems([]); // Clear cart on error or if unauthorized
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Fetch cart when token changes (login/logout) or on initial load
    if (!authLoading) { // Only fetch if auth context has finished loading
        fetchCart();
    }
  }, [token, authLoading, fetchCart]);

  // Add item to cart
  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!token) {
      setError('Please log in to add items to your cart.');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      };
      const body = { productId, quantity };
      const res = await axios.post('http://localhost:5000/api/cart', body, config);
      setCartItems(res.data.items);
      setLoading(false);
      return true; // Indicate success
    } catch (err) {
      console.error('Error adding to cart:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.msg || 'Failed to add item to cart. Check stock.');
      setLoading(false);
      return false; // Indicate failure
    }
  }, [token]);

  // Remove item from cart
  const removeFromCart = useCallback(async (productId) => {
    if (!token) {
      setError('Please log in to modify your cart.');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const res = await axios.delete(`http://localhost:5000/api/cart/item/${productId}`, config);
      setCartItems(res.data.items); // Backend sends back updated cart
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error removing from cart:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.msg || 'Failed to remove item from cart.');
      setLoading(false);
      return false;
    }
  }, [token]);

  // Update item quantity in cart
  const updateCartQuantity = useCallback(async (productId, quantity) => {
    if (!token) {
      setError('Please log in to modify your cart.');
      return false;
    }
    if (quantity < 1) { // Prevent setting quantity to less than 1
        return removeFromCart(productId); // If quantity is 0 or less, treat as remove
    }

    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      };
      const body = { quantity };
      const res = await axios.put(`http://localhost:5000/api/cart/item/${productId}`, body, config);
      setCartItems(res.data.items);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error updating cart quantity:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.msg || 'Failed to update item quantity.');
      setLoading(false);
      return false;
    }
  }, [token, removeFromCart]);

  // Clear the entire cart
  const clearCart = useCallback(async () => {
    if (!token) {
      setError('Please log in to clear your cart.');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.delete('http://localhost:5000/api/cart/clear', config);
      setCartItems([]); // Clear local state after successful backend clear
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error clearing cart:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.msg || 'Failed to clear cart.');
      setLoading(false);
      return false;
    }
  }, [token]);


  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    fetchCart // Expose fetchCart so components can manually refetch if needed
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};