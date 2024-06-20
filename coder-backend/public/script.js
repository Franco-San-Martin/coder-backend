document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.on('newProduct', (product) => {
        const productList = document.getElementById('productList');
        const li = document.createElement('li');
        li.textContent = `${product.title} - ${product.price}`;
        productList.appendChild(li);
    });

    socket.on('deleteProduct', (product) => {
        const productList = document.getElementById('productList');
        const items = productList.getElementsByTagName('li');
        for (let item of items) {
            if (item.textContent.includes(product.title)) {
                productList.removeChild(item);
                break;
            }
        }
    });
});