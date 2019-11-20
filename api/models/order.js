// 6. Mongoose works to connect our backend app with the database
//when we get post request, we get all the data (in the body) with the request
//Mongoose creates object in Database, but it needs Model and Schema

const mongoose = require('mongoose'); 

//6. creating Schema
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //connect product to our order. In this exemple we have only one type of product for the order
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true}, //7.
    quantity: { type: Number, default: 1 }
});

//First argument is the name what we want to use outside
module.exports = mongoose.model('Order', orderSchema);