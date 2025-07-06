// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures each email is unique in the database
    lowercase: true, // Stores emails in lowercase
    trim: true // Removes whitespace from both ends of a string
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum password length
  },
  role: {
    type: String,
    enum: ['customer', 'admin'], // Enforce specific roles
    default: 'customer' // Default role for new users
  },
  createdAt: {
    type: Date,
    default: Date.now // Automatically adds a creation timestamp
  }
});

module.exports = mongoose.model('User', userSchema);