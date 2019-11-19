const express = require('express');

//now we can use all utulity]ies of express
const app = express();

const productRoutes = require('./api/routes/products'); //import module router from products
const orderRoutes = require('./api/routes/orders'); //import module router from orders

//incoming request has to go through app method 'use'. This is our middleware

app.use('/products', productRoutes); //'/products' works as a filter
app.use('/orders', orderRoutes); //'/orders' works as a filter

module.exports = app;