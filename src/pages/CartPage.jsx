// src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, loading, error, removeFromCart, updateCartQuantity, clearCart } = useCart();

  // IMPORTANT: Filter out any cart items where product data is missing or invalid.
  // This prevents the "toFixed of undefined" error if item.product or item.product.price is missing
  const validCartItems = cartItems.filter(item =>
    item.product && // Check if item.product object exists
    item.product._id && // Check if item.product has an _id (implies it's a populated product)
    typeof item.product.price === 'number' // Check if item.product.price is a number
  );

  // Calculate total price using only valid items
  const calculateTotal = () => {
    return validCartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  // --- Render Loading, Error, and Empty Cart states first ---
  if (loading) {
    // Themed loading text
    return <div className="text-center mt-8 text-xl text-light-text">Loading cart...</div>;
  }

  if (error) {
    // Themed error text
    return <div className="text-center mt-8 text-red-400 text-xl">Error: {error}</div>;
  }

  // If after filtering, there are no valid items, show empty cart message
  if (validCartItems.length === 0) {
    // We can differentiate if the original cart was empty or if it had invalid items
    const hadInvalidItems = cartItems.length > 0 && validCartItems.length === 0;

    return (
      // Themed background, shadow, and border for the empty cart message box
      <div className="text-center mt-16 p-8 bg-secondary-bg rounded-lg shadow-xl border border-dark-border max-w-md mx-auto">
        {/* Themed heading text */}
        <h2 className="text-2xl font-semibold mb-4 text-light-text">
          {hadInvalidItems ? 'Your Cart Contains No Valid Items' : 'Your Cart is Empty'}
        </h2>
        {/* Themed paragraph text */}
        <p className="text-medium-text mb-6">
          {hadInvalidItems
            ? 'Some items might have been removed, are no longer available, or had incomplete data.'
            : 'Looks like you haven\'t added anything to your cart yet.'}
        </p>
        {/* Themed button with accent colors */}
        <Link to="/products" className="bg-accent-500 hover:bg-accent-600 text-black font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out">
          Start Shopping
        </Link>
        {/* Optional: Button to clear potentially invalid items if they existed */}
        {cartItems.length > 0 && hadInvalidItems && (
           // Themed button with deeper red for destructive action
           <button
             onClick={clearCart} // Clears all items, including any invalid ones
             className="mt-4 bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
           >
             Clear Invalid Items
           </button>
        )}
      </div>
    );
  }

  // --- Render the actual cart contents if valid items exist ---
  return (
    // Overall page container. Assumes body already has primary-bg
    <div className="container mx-auto p-4 text-light-text">
      {/* Themed heading */}
      <h1 className="text-4xl font-bold text-center mb-8 text-light-text">Your Shopping Cart</h1>

      {/* Themed background, shadow, border for the cart items container */}
      <div className="bg-secondary-bg rounded-lg shadow-xl p-6 border border-dark-border">
        {/* Themed table header row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border-b border-dark-border pb-4 mb-4 font-semibold text-light-text">
          <div className="md:col-span-5">Product</div>
          <div className="md:col-span-2 text-center">Price</div>
          <div className="md:col-span-2 text-center">Quantity</div>
          <div className="md:col-span-2 text-center">Subtotal</div>
          <div className="md:col-span-1 text-center"></div> {/* For actions like remove */}
        </div>

        {/* Map over validCartItems ONLY - no more inline checks needed inside the map */}
        {validCartItems.map((item) => (
          // Themed border for each cart item row
          <div key={item.product._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-dark-border py-4">
            <div className="md:col-span-5 flex items-center">
              <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-md mr-4" />
              <div>
                {/* Themed product name link with accent colors */}
                <Link to={`/product/${item.product._id}`} className="text-lg font-semibold text-accent-500 hover:text-accent-600 transition-colors duration-200">
                  {item.product.name}
                </Link>
                {/* Themed stock text */}
                <p className="text-sm text-dark-text">Stock: {item.product.stock}</p>
              </div>
            </div>
            {/* Themed price text */}
            <div className="md:col-span-2 text-center text-lg text-medium-text">₹{item.product.price.toFixed(2)}</div>
            <div className="md:col-span-2 flex items-center justify-center space-x-2">
              {/* Themed quantity buttons */}
              <button
                onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}
                className="bg-dark-border hover:bg-gray-700 text-light-text font-bold py-1 px-3 rounded-full"
                disabled={item.quantity <= 1}
              >
                -
              </button>
              {/* Themed quantity text */}
              <span className="text-lg font-semibold text-light-text">{item.quantity}</span>
              <button
                onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}
                className="bg-dark-border hover:bg-gray-700 text-light-text font-bold py-1 px-3 rounded-full"
                disabled={item.quantity >= item.product.stock} // Disable if quantity reaches stock limit
              >
                +
              </button>
            </div>
            {/* Themed subtotal text */}
            <div className="md:col-span-2 text-center text-lg font-bold text-light-text">₹{(item.product.price * item.quantity).toFixed(2)}</div>
            <div className="md:col-span-1 text-center">
              {/* Themed remove button (soft red for icon) */}
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="text-red-400 hover:text-red-500 text-2xl"
                aria-label="Remove item"
              >
                &times; {/* HTML entity for multiplication sign, often used for close/remove */}
              </button>
            </div>
          </div>
        ))}

        {/* Themed total and action buttons section */}
        <div className="flex justify-end items-center mt-6 pt-4 border-t-2 border-dark-border">
          {/* Themed total price text */}
          <div className="text-2xl font-bold text-light-text mr-6">
            Total: ${calculateTotal().toFixed(2)}
          </div>
          {/* Themed Clear Cart button (deeper red for destructive action) */}
          <button
            onClick={clearCart}
            className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg mr-4 transition duration-300 ease-in-out"
          >
            Clear Cart
          </button>
          {/* Themed Proceed to Checkout button with accent colors */}
          <Link
            to="/checkout"
            className="bg-accent-500 hover:bg-accent-600 text-black font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;