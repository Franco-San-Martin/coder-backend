const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const cartsRouter = express.Router();
const cartsFilePath = path.join(__dirname, 'carrito.json');

const readDataFromFile = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

const writeDataToFile = (filePath, data) => {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData);
};

cartsRouter.get('/', (req, res) => {
    const carts = readDataFromFile(cartsFilePath);
    res.json(carts);
});

cartsRouter.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    const carts = readDataFromFile(cartsFilePath);
    const cart = carts.find(cart => cart.id === cartId);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

cartsRouter.post('/', (req, res) => {
    const newCart = {
        id: uuidv4(),
        products: []
    };
    const carts = readDataFromFile(cartsFilePath);
    carts.push(newCart);
    writeDataToFile(cartsFilePath, carts);
    res.status(201).json(newCart);
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    let carts = readDataFromFile(cartsFilePath);
    const cartIndex = carts.findIndex(cart => cart.id === cartId);
    if (cartIndex !== -1) {
        const cart = carts[cartIndex];
        const existingProductIndex = cart.products.findIndex(item => item.productId === productId);
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

cartsRouter.delete('/:cid', (req, res) => {
    const cartId = req.params.cid;
    let carts = readDataFromFile(cartsFilePath);
    carts = carts.filter(cart => cart.id !== cartId);
    writeDataToFile(cartsFilePath, carts);
    res.send(`Carrito con ID ${cartId} eliminado correctamente`);
});

module.exports = cartsRouter;
