// 6. Mongoose works to connect our backend app with the database
//when we get post request, we get all the data (in the body) with the request
//Mongoose creates object in Database, but it needs Model and Schema

const mongoose = require('mongoose'); 

//6. creating Schema
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: { type: String, required: true }
});

//First argument is the name what we want to use outside
module.exports = mongoose.model('User', userSchema);