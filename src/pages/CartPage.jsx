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
    return <div className="text-center mt-8 text-xl">Loading cart...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500 text-xl">Error: {error}</div>;
  }

  // If after filtering, there are no valid items, show empty cart message
  if (validCartItems.length === 0) {
    // We can differentiate if the original cart was empty or if it had invalid items
    const hadInvalidItems = cartItems.length > 0 && validCartItems.length === 0;

    return (
      <div className="text-center mt-16 p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {hadInvalidItems ? 'Your Cart Contains No Valid Items' : 'Your Cart is Empty'}
        </h2>
        <p className="text-gray-600 mb-6">
          {hadInvalidItems
            ? 'Some items might have been removed, are no longer available, or had incomplete data.'
            : 'Looks like you haven\'t added anything to your cart yet.'}
        </p>
        <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out">
          Start Shopping
        </Link>
        {/* Optional: Button to clear potentially invalid items if they existed */}
        {cartItems.length > 0 && hadInvalidItems && (
           <button
             onClick={clearCart} // Clears all items, including any invalid ones
             className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
           >
             Clear Invalid Items
           </button>
        )}
      </div>
    );
  }

  // --- Render the actual cart contents if valid items exist ---
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Your Shopping Cart</h1>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border-b pb-4 mb-4 font-semibold text-gray-700">
          <div className="md:col-span-5">Product</div>
          <div className="md:col-span-2 text-center">Price</div>
          <div className="md:col-span-2 text-center">Quantity</div>
          <div className="md:col-span-2 text-center">Subtotal</div>
          <div className="md:col-span-1 text-center"></div> {/* For actions like remove */}
        </div>

        {/* Map over validCartItems ONLY - no more inline checks needed inside the map */}
        {validCartItems.map((item) => (
          <div key={item.product._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b py-4">
            <div className="md:col-span-5 flex items-center">
              <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-md mr-4" />
              <div>
                <Link to={`/product/${item.product._id}`} className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200">
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500">Stock: {item.product.stock}</p>
              </div>
            </div>
            <div className="md:col-span-2 text-center text-lg text-gray-700">${item.product.price.toFixed(2)}</div>
            <div className="md:col-span-2 flex items-center justify-center space-x-2">
              <button
                onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded-full"
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="text-lg font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded-full"
                disabled={item.quantity >= item.product.stock} // Disable if quantity reaches stock limit
              >
                +
              </button>
            </div>
            <div className="md:col-span-2 text-center text-lg font-bold text-gray-800">${(item.product.price * item.quantity).toFixed(2)}</div>
            <div className="md:col-span-1 text-center">
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="text-red-600 hover:text-red-800 text-2xl"
                aria-label="Remove item"
              >
                &times; {/* HTML entity for multiplication sign, often used for close/remove */}
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-end items-center mt-6 pt-4 border-t-2 border-gray-200">
          <div className="text-2xl font-bold text-gray-900 mr-6">
            Total: ${calculateTotal().toFixed(2)}
          </div>
          <button
            onClick={clearCart}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg mr-4 transition duration-300 ease-in-out"
          >
            Clear Cart
          </button>
          <Link
          to="/checkout"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
        >
          Proceed to Checkout
        </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;