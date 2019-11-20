const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); //we need mongoose here to create id

const Order = require('../models/order');
const Product = require('../models/product'); //we will use this in the cheching if we order existing product

//if we want to add product information into the orders list or into the single order
//see the router.get, we add there method .populate()

//Handle incoming  GET request to /orders
//get is the method which handles incoming get requiests
//its address is '/products', but we want to reach this one directly using '/' from the app.js
// argument 'next' (which is the arrow function) pushes our request to the next 
// middlewqre line 
router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        //if we want to add product information into the orders list or into the single order
        .populate('product', '_id name price') // 'product' - populated object, 'name price' - list of properties of the populated object
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: "GET",
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    //adding some logic to control cases if we try to add to the order the product which doesn't exist
    Product.findById(req.body.productId)
        .then(product => {
            if(!product) {
                return res.status(404).json({
                    message: 'Product not found by this ID'
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),//executed as a function to automaticaly generate id
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order
                .save() //don't need exec(), coz save() gives us real promise as default      
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "POST",
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.get('/:orderId', (req, res, next) => {
    //we get params here from incoming request
    const id = req.params.orderId;
    Order.findById(id)
        .populate('product', '_id name price')
        .exec()
        .then(order => {
            if(!order) {
                res.status(404).json({
                    message: 'Order not found by requested id'
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: "GET",
                    url: 'http://localhost:3000/orders/'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
})

router.delete('/:orderId', (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'DELETE',
                    url: 'http://localhost:3000/orders',
                    body: { productId: 'ID', quantity: 'Number' }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
})

module.exports = router;