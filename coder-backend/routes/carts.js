const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const router = express.Router();

// POST new cart
router.post('/', async (req, res) => {
    try {
        const newCart = new Cart();
        await newCart.save();
        res.status(201).json({ status: 'success', message: 'Cart created', cart: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET cart by id with products populated
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE product from cart
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

        cart.products = cart.products.filter(item => item.product.toString() !== req.params.pid);
        await cart.save();
        res.json({ status: 'success', message: 'Product removed from cart', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT update cart with array of products
router.put('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

        cart.products = req.body.products;
        await cart.save();
        res.json({ status: 'success', message: 'Cart updated', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT update product quantity in cart
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

        const productIndex = cart.products.findIndex(item => item.product.toString() === req.params.pid);
        if (productIndex === -1) return res.status(404).json({ status: 'error', message: 'Product not found in cart' });

        cart.products[productIndex].quantity = quantity;
        await cart.save();
        res.json({ status: 'success', message: 'Product quantity updated', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE all products from cart
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

        cart.products = [];
        await cart.save();
        res.json({ status: 'success', message: 'All products removed from cart', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;