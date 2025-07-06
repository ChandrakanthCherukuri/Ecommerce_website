// backend/routes/order.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth'); // Your authentication middleware
const Order = require('../models/Order');
const Cart = require('../models/Cart'); // To clear the cart after order
const Product = require('../models/Product'); // To update stock

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post(
    '/',
    [
        auth, // User must be authenticated
        [
            // Basic validation for shipping address (can be expanded)
            check('shippingAddress.fullName', 'Full Name is required').not().isEmpty(),
            check('shippingAddress.address', 'Address is required').not().isEmpty(),
            check('shippingAddress.city', 'City is required').not().isEmpty(),
            check('shippingAddress.postalCode', 'Postal Code is required').not().isEmpty(),
            check('shippingAddress.country', 'Country is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { shippingAddress, paymentResult } = req.body; // paymentResult will be used later

        try {
            // 1. Get the user's cart (with populated products)
            const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ msg: 'Cart is empty. Cannot create an order.' });
            }

            let totalAmount = 0;
            const orderItems = [];
            const bulkOperations = []; // For updating product stock

            // 2. Process cart items: Check stock, calculate total, prepare orderItems
            for (const cartItem of cart.items) {
                const product = cartItem.product; // This is the populated product object

                // Important: Verify product exists and is in stock
                if (!product || product.stock < cartItem.quantity) {
                    return res.status(400).json({
                        msg: `Product ${product ? product.name : 'Unknown'} is out of stock or not found. Available: ${product ? product.stock : 0}`,
                    });
                }

                totalAmount += product.price * cartItem.quantity;

                orderItems.push({
                    product: product._id, // Store just the ID in orderItems
                    name: product.name,
                    quantity: cartItem.quantity,
                    price: product.price,
                    imageUrl: product.imageUrl,
                });

                // Prepare stock update operation
                bulkOperations.push({
                    updateOne: {
                        filter: { _id: product._id },
                        update: { $inc: { stock: -cartItem.quantity } },
                    },
                });
            }

            // 3. Create the new Order
            const newOrder = new Order({
                user: req.user.id,
                orderItems,
                shippingAddress,
                totalAmount: totalAmount.toFixed(2), // Ensure total is formatted
                // isPaid and paidAt will be updated after actual payment (later)
                // paymentResult will be set after actual payment (later)
            });

            // 4. Save the Order
            const order = await newOrder.save();

            // 5. Update Product Stock (using bulk write for efficiency)
            if (bulkOperations.length > 0) {
                await Product.bulkWrite(bulkOperations);
            }

            // 6. Clear the user's cart
            cart.items = [];
            await cart.save();

            res.status(201).json(order); // Return the created order
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;