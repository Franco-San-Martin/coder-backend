const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { readDataFromFile, writeDataToFile } = require('../../../utils');

const router = express.Router();
const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');

// Ruta raíz GET /api/products/
router.get('/', (req, res) => {
    const products = readDataFromFile(productsFilePath);
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
});

// Ruta GET /api/products/:pid
router.get('/:pid', (req, res) => {
    const productId = req.params.pid;
    const products = readDataFromFile(productsFilePath);
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

// Ruta POST /api/products/
router.post('/', (req, res) => {
    const newProduct = req.body;
    newProduct.id = uuidv4(); // Generamos un ID único para el nuevo producto
    const products = readDataFromFile(productsFilePath);
    products.push(newProduct);
    writeDataToFile(productsFilePath, products);
    res.status(201).send('Producto agregado correctamente');
});

// Ruta PUT /api/products/:pid
router.put('/:pid', (req, res) => {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    const products = readDataFromFile(productsFilePath);
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        updatedProduct.id = productId; // Aseguramos que el ID no se actualice
        products[productIndex] = updatedProduct;
        writeDataToFile(productsFilePath, products);
        res.send('Producto actualizado correctamente');
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
    const productId = req.params.pid;
    let products = readDataFromFile(productsFilePath);
    products = products.filter(p => p.id !== productId);
    writeDataToFile(productsFilePath, products);
    res.send('Producto eliminado correctamente');
});

module.exports = router;
