// backend/routes/cart.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const {auth} = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @route   GET api/cart
// @desc    Get user cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price imageUrl stock');
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/cart
// @desc    Add item to cart
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('productId', 'Product ID is required').not().isEmpty(),
      check('quantity', 'Quantity must be a number and at least 1').isInt({ min: 1 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
      if (product.stock < quantity) {
        return res.status(400).json({ msg: `Not enough stock for ${product.name}. Available: ${product.stock}` });
      }

      let cart = await Cart.findOne({ user: req.user.id });

      if (cart) {
        let itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
          let cartItem = cart.items[itemIndex];
          if (product.stock < (cartItem.quantity + quantity)) {
            return res.status(400).json({ msg: `Adding ${quantity} of ${product.name} would exceed stock. Current in cart: ${cartItem.quantity}, Available: ${product.stock}` });
          }
          cartItem.quantity += quantity;
          cart.items[itemIndex] = cartItem;
        } else {
          cart.items.push({ product: productId, quantity });
        }
        await cart.save();
        // --- ADD THIS POPULATE LINE FOR EXISTING CART UPDATE ---
        cart = await cart.populate('items.product', 'name price imageUrl stock'); // Populate before sending
        res.json(cart);
      } else {
        const newCart = new Cart({
          user: req.user.id,
          items: [{ product: productId, quantity }],
        });
        const savedCart = await newCart.save();
        // --- ADD THIS POPULATE LINE FOR NEW CART CREATION ---
        const populatedCart = await savedCart.populate('items.product', 'name price imageUrl stock'); // Populate before sending
        res.json(populatedCart);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/cart/item/:productId
// @desc    Update item quantity in cart
// @access  Private
router.put(
  '/item/:productId',
  [
    auth,
    [
      check('quantity', 'Quantity must be a number and at least 1').isInt({ min: 1 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId } = req.params;
    const { quantity } = req.body;

    try {
      let cart = await Cart.findOne({ user: req.user.id });
      if (!cart) {
        return res.status(404).json({ msg: 'Cart not found' });
      }

      let itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex === -1) {
        return res.status(404).json({ msg: 'Product not found in cart' });
      }

      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ msg: 'Product not found' });
      }
      if (product.stock < quantity) {
          return res.status(400).json({ msg: `Not enough stock for ${product.name}. Available: ${product.stock}` });
      }

      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      // --- ADD THIS POPULATE LINE FOR QUANTITY UPDATE ---
      cart = await cart.populate('items.product', 'name price imageUrl stock'); // Populate before sending
      res.json(cart);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/cart/item/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/item/:productId', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();
    // Optional: Populate here too if frontend relies on full cart after removal
    // cart = await cart.populate('items.product', 'name price imageUrl stock');
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/cart/clear
// @desc    Clear the entire cart
// @access  Private
router.delete('/clear', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    cart.items = []; // Empty the items array
    await cart.save();
    res.json({ msg: 'Cart cleared successfully' }); // No need to populate for clear
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;