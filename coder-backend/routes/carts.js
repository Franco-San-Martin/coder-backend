const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { readDataFromFile, writeDataToFile } = require('../../../utils');

const router = express.Router();
const cartsFilePath = path.join(__dirname, '..', 'data', 'carts.json');

// Ruta POST /api/carts/
router.post('/', (req, res) => {
    const newCart = { id: uuidv4(), products: [] };
    const carts = readDataFromFile(cartsFilePath);
    carts.push(newCart);
    writeDataToFile(cartsFilePath, carts);
    res.status(201).json(newCart);
});

// Ruta GET /api/carts/:cid
router.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    const carts = readDataFromFile(cartsFilePath);
    const cart = carts.find(c => c.id === cartId);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    const carts = readDataFromFile(cartsFilePath);
    const cartIndex = carts.findIndex(c => c.id === cartId);
    if (cartIndex !== -1) {
        const cart = carts[cartIndex];
        const existingProductIndex = cart.products.findIndex(p => p.productId === productId);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }
        carts[cartIndex] = cart;
        writeDataToFile(cartsFilePath, carts);
        res.status(201).send('Producto agregado al carrito correctamente');
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

module.exports = router;
