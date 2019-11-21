const express = require('express');
//now we can use all utilities of express
const app = express();
//4. login package morgan
const morgan = require('morgan');
// 5.
const bodyParser = require('body-parser');
// 6.
const mongoose = require('mongoose');

//Routes which should handle requests
const userRoutes = require('./api/routes/user'); //import module router from user
const productRoutes = require('./api/routes/products'); //import module router from products
const orderRoutes = require('./api/routes/orders'); //import module router from orders

//6.
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/node-rest-api', { useUnifiedTopology: true, useNewUrlParser: true });
//7. to use default NodeJS promise implementation
mongoose.Promise = global.Promise;

let db = mongoose.connection;
//check db connection
db.once('open', function() {
    console.log('Connected to MongoDB');
});
//check db for errors
db.on('error', function(err){
    console.log(err);
});

//4. using morgan middleware
app.use(morgan('dev'));
//making folder 'uploads' to be visible
// '/uploads' is in the beginning to parse only requests wiwh /uploads
//the we apply our middleware
app.use('/uploads', express.static('uploads'))
//5. using body-parser middleware
app.use(bodyParser.urlencoded({extended: false})); //false - only for simple data
app.use(bodyParser.json());

//5. appending the headers to any response that we should send back
//In the header will be information to the client that everything is ok and it can use
//current port (which shoild be different with server's port - 3000 and 5000 for ex.)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') //'*' to give access to any origin (client)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    //method - property which give us access to http-method-used-only requests
    //browser always sends 'OPTIONS' first when we send POST, PUT request
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});

//incoming request has to go through app method 'use'. This is our middleware
app.use('/user', userRoutes); //11.
app.use('/products', productRoutes); //'/products' works as a filter
app.use('/orders', orderRoutes); //'/orders' works as a filter

// 4.
app.use((req, res, next) => {
    const error = new Error('This url is not found');
    error.status = 404;
    next(error);
})

//4. this method handles all errors which come from the application
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;