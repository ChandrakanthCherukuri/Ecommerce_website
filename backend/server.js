// backend/server.js
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the CORS middleware

const authRoutes = require('./routes/auth');       // Import authentication routes
const productRoutes = require('./routes/product'); // Corrected from './routes/product' for consistency. Make sure your product routes file is named products.js
const cartRoutes = require('./routes/cart');       // Import cart routes
const { auth } = require('./middleware/auth');     // Import authentication middleware

const app = express();
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000
const MONGO_URI = process.env.MONGO_URI; // Get MongoDB URI from .env

// --- Middleware ---
// Enable CORS for your frontend application
app.use(cors({
  origin: 'http://localhost:3000', // IMPORTANT: Replace with your React app's URL (e.g., 'http://localhost:3000')
  credentials: true // Allow cookies to be sent (if you decide to use HttpOnly cookies for JWT)
}));

// Parse JSON request bodies
app.use(express.json());

// --- Database Connection ---
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true, // Deprecated in newer Mongoose versions
  // useFindAndModify: false // Deprecated in newer Mongoose versions
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  // Exit process with failure
  process.exit(1);
});

// --- Routes ---
// Authentication routes (login, register) - these are public
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // Product routes (might have admin-only protected routes inside)
app.use('/api/cart', cartRoutes);       // Add this line for cart routes
app.use('/api/orders', require('./routes/order'));

// Protected route example - requires a valid JWT
app.get('/api/protected', auth, (req, res) => {
  // If the middleware passes, req.user will contain the decoded JWT payload
  res.json({
    msg: `Welcome, user ${req.user.id}! You have access to protected data.`,
    user: req.user // You can send back user info from the token
  });
});

// Basic route for root URL
app.get('/', (req, res) => {
  res.send('E-commerce Backend API is running!');
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});