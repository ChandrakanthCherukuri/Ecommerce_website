// backend/models/Cart.js
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // References the Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1, // Default quantity is 1 when adding to cart
    min: [1, 'Quantity can not be less than 1.'], // Ensure quantity is at least 1
  },
}, { _id: false }); // Do not create a separate _id for subdocuments (cart items)

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User model
    required: true,
    unique: true, // Each user can only have one cart
  },
  items: [CartItemSchema], // Array of cart items
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Cart', CartSchema);