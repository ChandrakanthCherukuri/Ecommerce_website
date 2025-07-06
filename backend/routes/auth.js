// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For creating and verifying JWTs
const User = require('../models/User'); // Import the User Mongoose model

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation (more robust validation should be added)
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields (email and password)' });
  }

  try {
    // Check if user with this email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }

    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash password with the salt

    // Create a new user instance
    user = new User({
      email,
      password: hashedPassword,
      // 'role' will default to 'customer' as defined in the User schema
    });

    // Save the new user to the database
    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id, // Mongoose virtual getter for _id
        role: user.role // Include user role in the token
      },
    };

    // Sign the JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Your secret key from .env
      { expiresIn: '1h' }, // Token expiration time (e.g., 1 hour)
      (err, token) => {
        if (err) {
          console.error('JWT signing error:', err.message);
          throw err; // Propagate error for catch block
        }
        // Send success message and the token back to the client
        res.status(201).json({
          msg: 'User registered successfully',
          token,
          user: { id: user.id, email: user.email, role: user.role } // Optionally send back basic user info
        });
      }
    );

  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).send('Server error during registration');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields (email and password)' });
  }

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' }); // Use generic message for security
    }

    // Compare provided password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role
      },
    };

    // Sign the JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('JWT signing error:', err.message);
          throw err;
        }
        // Send the token back to the client
        res.json({
          token,
          user: { id: user.id, email: user.email, role: user.role } // Optionally send back basic user info
        });
      }
    );

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error during login');
  }
});

module.exports = router;