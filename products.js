const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const productsRouter = express.Router();
const productsFilePath = path.join(__dirname, 'productos.json');

const readDataFromFile = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

const writeDataToFile = (filePath, data) => {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData);
};

productsRouter.get('/', (req, res) => {
    const products = readDataFromFile(productsFilePath);
    res.json(products);
});

productsRouter.get('/:pid', (req, res) => {
    const productId = req.params.pid;
    const products = readDataFromFile(productsFilePath);
    const product = products.find(prod => prod.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

productsRouter.post('/', (req, res) => {
    const newProduct = req.body;
    newProduct.id = uuidv4();
    const products = readDataFromFile(productsFilePath);
    products.push(newProduct);
    writeDataToFile(productsFilePath, products);
    res.status(201).send('Producto agregado correctamente');
});

productsRouter.put('/:pid', (req, res) => {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    const products = readDataFromFile(productsFilePath);
    const productIndex = products.findIndex(prod => prod.id === productId);
    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedProduct };
        writeDataToFile(productsFilePath, products);
        res.send(`Producto con ID ${productId} actualizado correctamente`);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

productsRouter.delete('/:pid', (req, res) => {
    const productId = req.params.pid;
    let products = readDataFromFile(productsFilePath);
    products = products.filter(product => product.id !== productId);
    writeDataToFile(productsFilePath, products);
    res.send(`Producto con ID ${productId} eliminado correctamente`);
});

module.exports = productsRouter;
