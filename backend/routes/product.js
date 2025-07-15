// backend/routes/product.js
const express = require('express');
const Product = require('../models/Product'); // Import your Product model
const { auth, authorizeRoles } = require('../middleware/auth'); // Import both auth and authorizeRoles

const router = express.Router();

// --- Product Management Routes ---

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Admin Only)
// Requires: JWT token AND user role must be 'admin'
router.post('/', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const product = new Product(req.body); // Create a new product instance from request body
    await product.save(); // Save the product to MongoDB
    res.status(201).json({ msg: 'Product created successfully', product });
  } catch (err) {
    console.error('Error creating product:', err.message);
    // Handle specific error for duplicate product name if unique index constraint fails
    if (err.code === 11000 && err.keyPattern && err.keyPattern.name) {
      return res.status(400).json({ msg: 'Product with this name already exists.' });
    }
    // Generic server error for other issues
    res.status(500).send('Server error while creating product');
  }
});

// @route   GET /api/products
// @desc    Get all products or filter by category
// @access  Public (Anyone can view products)
router.get('/', async (req, res) => { // <--- THIS IS THE ROUTE TO UPDATE
  try {
    const { category } = req.query; // Extract the 'category' query parameter from the URL
    let filter = {}; // Initialize an empty filter object

    // If a category query parameter is provided (e.g., /api/products?category=fashion)
    if (category) {
      // Add the category to our filter object.
      // Mongoose will then use this to filter results from the database.
      filter.category = category;
    }

    // Use the filter object in the Mongoose find method
    // If filter is empty ({}), it will return all products.
    // If filter is { category: 'fashion' }, it will return only fashion products.
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).send('Server error while fetching products');
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public (Anyone can view a specific product)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Find product by its ID
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' }); // If no product found with that ID
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product by ID:', err.message);
    // Handle case where the provided ID is not a valid MongoDB ObjectId format
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid product ID format' });
    }
    res.status(500).send('Server error while fetching product');
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product by ID
// @access  Private (Admin Only)
// Requires: JWT token AND user role must be 'admin'
router.put('/:id', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, // ID of the product to update
      req.body,      // Data to update with
      { new: true, runValidators: true } // Options: return updated doc, run schema validators
    );
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json({ msg: 'Product updated successfully', product });
  } catch (err) {
    console.error('Error updating product:', err.message);
    // Handle invalid ID format
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid product ID format' });
    }
    // Handle unique constraint error if name is changed to an existing one
    if (err.code === 11000 && err.keyPattern && err.keyPattern.name) {
      return res.status(400).json({ msg: 'Product with this name already exists.' });
    }
    res.status(500).send('Server error while updating product');
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product by ID
// @access  Private (Admin Only)
// Requires: JWT token AND user role must be 'admin'
router.delete('/:id', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id); // Find and delete product
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json({ msg: 'Product removed successfully' });
  } catch (err) {
    console.error('Error deleting product:', err.message);
    // Handle invalid ID format
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid product ID format' });
    }
    res.status(500).send('Server error while deleting product');
  }
});

module.exports = router;