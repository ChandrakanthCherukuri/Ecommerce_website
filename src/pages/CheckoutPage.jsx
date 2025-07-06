// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Make sure Link is imported
import { useCart } from '../context/CartContext';
import axios from 'axios';

const CheckoutPage = () => {
  const { cartItems, loading, error, clearCart, fetchCart } = useCart();
  const navigate = useNavigate();

  console.log('CheckoutPage: loading', loading);
  console.log('CheckoutPage: error', error);
  console.log('CheckoutPage: cartItems', cartItems);
  console.log('CheckoutPage: validCartItems length', cartItems.filter(item =>
    item.product && item.product._id && typeof item.product.price === 'number'
  ).length);
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  // Filter valid items for display and total calculation
  const validCartItems = cartItems.filter(item =>
    item.product && item.product._id && typeof item.product.price === 'number'
  );

  const calculateTotal = () => {
    return validCartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setCheckoutError(null);

    if (validCartItems.length === 0) {
      setCheckoutError("Your cart is empty. Please add items before checking out.");
      setCheckoutLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      };

      const orderData = {
        shippingAddress,
        // paymentResult: {} // This will be filled after payment integration
      };

      const res = await axios.post('/api/orders', orderData, config);

      clearCart(); // Clear the cart context state
      await fetchCart(); // Re-fetch cart to ensure it's empty from the server's perspective

      navigate(`/order/${res.data._id}`); // We'll create this page later
      alert('Order placed successfully! (Payment is not integrated yet)');

    } catch (err) {
      console.error('Error placing order:', err.response?.data || err);
      setCheckoutError(err.response?.data?.msg || 'Failed to place order. Please check your details and try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Display loading/error for cart data first
  if (loading) {
    return <div className="text-center mt-8 text-xl">Loading cart...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500 text-xl">Error loading cart: {error}</div>;
  }

  // --- This is the key part that determines what gets rendered ---
  if (validCartItems.length === 0) {
    return (
      <div className="text-center mt-16 p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Add items to your cart before proceeding to checkout.</p>
        <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Checkout</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Order Summary</h2>
        <div className="border-b pb-4 mb-4">
          {validCartItems.map((item) => (
            <div key={item.product._id} className="flex justify-between items-center py-2">
              <div className="flex items-center">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded mr-4" />
                <span className="text-gray-800">{item.product.name} x {item.quantity}</span>
              </div>
              <span className="text-gray-700">${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-xl font-bold text-gray-900">
          <span>Total:</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Shipping Information</h2>
        <form onSubmit={handlePlaceOrder}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={shippingAddress.fullName}
              onChange={handleAddressChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address Line 1</label>
            <input
              type="text"
              id="address"
              name="address"
              value={shippingAddress.address}
              onChange={handleAddressChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={shippingAddress.city}
              onChange={handleAddressChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="postalCode" className="block text-gray-700 text-sm font-bold mb-2">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={shippingAddress.postalCode}
              onChange={handleAddressChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={shippingAddress.country}
              onChange={handleAddressChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {checkoutError && <p className="text-red-500 text-center mb-4">{checkoutError}</p>}

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={checkoutLoading}
          >
            {checkoutLoading ? 'Placing Order...' : 'Place Order (No Payment Yet)'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;