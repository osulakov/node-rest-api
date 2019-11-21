// 6. Mongoose works to connect our backend app with the database
//when we get post request, we get all the data (in the body) with the request
//Mongoose creates object in Database, but it needs Model and Schema

const mongoose = require('mongoose'); 

//6. creating Schema
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    mileage: { type: Number, required: true },
    fuel: { type: String, required: true },
    engine: { type: Number, required: true },
    transmission: { type: String, required: true },
    other: { type: String, required: false },
    price: { type: Number, required: true }, //7.
    productImage: {type: String, required: true} //10.
});

//First argument is the name what we want to use outside
module.exports = mongoose.model('Product', productSchema);