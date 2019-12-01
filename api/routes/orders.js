const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders_controller');

//if we want to add product information into the orders list or into the single order
//see the router.get, we add there method .populate()

//Handle incoming  GET request to /orders
//get is the method which handles incoming get requiests
//its address is '/products', but we want to reach this one directly using '/' from the app.js

router.get('/', OrdersController.orders_get_all);

router.get('/user_orders', OrdersController.orders_get_users_orders);

router.post('/', OrdersController.orders_create_order);

router.get('/:orderId', checkAuth, OrdersController.orders_get_one_order);

router.delete('/:orderId', checkAuth, OrdersController.orders_delete_one_order)

module.exports = router;