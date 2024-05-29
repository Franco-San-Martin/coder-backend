const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { readDataFromFile, writeDataToFile } = require('./utils');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

const productsFilePath = path.join(__dirname, 'data', 'products.json');
const cartsFilePath = path.join(__dirname, 'data', 'carts.json');

// Configurar Handlebars
app.engine('handlebars', require('express-handlebars')());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas para productos
const productsRouter = require('./ecommerce-server/coder-backend/routes/products');
app.use('/api/products', productsRouter);

// Rutas para carritos
const cartsRouter = require('./ecommerce-server/coder-backend/routes/carts');
app.use('/api/carts', cartsRouter);

// Ruta para la vista home
app.get('/', (req, res) => {
    const products = readDataFromFile(productsFilePath);
    res.render('home', { products });
});

// Ruta para la vista realTimeProducts
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

// Configurar el servidor de Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('newProduct', (product) => {
        const products = readDataFromFile(productsFilePath);
        product.id = uuidv4();
        products.push(product);
        writeDataToFile(productsFilePath, products);
        io.emit('updateProducts', products);
    });

    socket.on('deleteProduct', (productId) => {
        let products = readDataFromFile(productsFilePath);
        products = products.filter(p => p.id !== productId);
        writeDataToFile(productsFilePath, products);
        io.emit('updateProducts', products);
    });
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});