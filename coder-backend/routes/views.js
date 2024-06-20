const express = require('express');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const router = express.Router();

router.get('/products', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}
    };
    const filter = query ? { $or: [{ category: query }, { status: query === 'true' }] } : {};

    const products = await Product.paginate(filter, options);

    res.render('products', {
        products: products.docs,
        totalPages: products.totalPages,
        prevPage: products.hasPrevPage ? page - 1 : null,
        nextPage: products.hasNextPage ? page + 1 : null,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
        nextLink: products.hasNextPage ? `/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null
    });
});

router.get('/products/:pid', async (req, res) => {
    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).render('404', { message: 'Product not found' });
    res.render('productDetails', { product });
});

router.get('/carts/:cid', async (req, res) => {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).render('404', { message: 'Cart not found' });
    res.render('cart', { cart });
});

module.exports = router;