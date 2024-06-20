const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const { io } = require('../server');

// GET all products with pagination and filters
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}
        };
        const filter = query ? { $or: [{ category: query }, { status: query === 'true' }] } : {};

        const products = await Product.paginate(filter, options);

        const response = {
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.hasPrevPage ? page - 1 : null,
            nextPage: products.hasNextPage ? page + 1 : null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET product by id
router.get('/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// POST new product
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        io.emit('newProduct', newProduct);
        res.status(201).json({ status: 'success', message: 'Product added', product: newProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT update product by id
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ status: 'error', message: 'Product not found' });
        res.json({ status: 'success', message: 'Product updated', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE product by id
router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) return res.status(404).json({ status: 'error', message: 'Product not found' });
        io.emit('deleteProduct', deletedProduct);
        res.json({ status: 'success', message: 'Product deleted', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;