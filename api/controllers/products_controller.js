const mongoose = require('mongoose');

//6. importing the productSchema
const Product = require('../models/product');


//argument 'next' (which is the arrow function) pushes our request to the next 
//middlewqre line
exports.products_get_all = (req, res, next) => {
    Product.find()
        //.select('name price _id productImage') //which elements we want to show in response
        .exec() //we use this method to get a real promise
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs // 7.  if I want to send standart object info with response
                // products: docs.map(doc => { //7. if I want to send more info with response
                //     return {
                //         name: doc.name,
                //         price: doc.price,
                //         _id:  doc._id,
                //         productImage: doc.productImage,
                //         request: {
                //             type: "GET",
                //             url: 'http://localhost:3000/products' + doc._id
                //         }
                //     }
                // })
            }
            res.status(200).json(response); //sending json response (can check it using Post software)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}

exports.products_create_product = (req, res, next) => {
    // upload.single('productImage') - for uploading image
    console.log(req.body);
    const product = new Product({ //6. creating const to store new object (product) to db
        _id: new mongoose.Types.ObjectId(),//executed as a function to automaticaly generate id
        name: req.body.name,
        model: req.body.model,
        year: req.body.year,
        color: req.body.color,
        mileage: req.body.mileage,
        fuel: req.body.fuel,
        engine: req.body.engine,
        transmission: req.body.transmission,
        other: req.body.other,
        price: req.body.price,
        productImage: req.file.path
    }); 
    product
        .save() //6. saving our new created object (using data from request) (product) to the db
        .then(result => { //chaning function 'then' (is a promise)
            console.log(result);
            res.status(201).json({
                message: 'Handling POST request to /products. Created object succesfully',
                result: result
                // createdProduct: { // 7.
                //     name: result.name,
                //     price: result.price,
                //     _id: result._id,
                //     productImage: result.productImage,
                //     request: {
                //         type: 'POST',
                //         url: 'http://localhost:3000/products' + result._id
                //     }
                // } 
            }); //sending json response
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(
                {
                    error: err,
                    req: req.body
                });
        }); //chaning 'catch' to catch errors
}

exports.products_get_one_product = (req, res, next) => {
    //we get params here from incoming request
    const id = req.params.productId;
    //6.
    Product.findById(id)
        //.select('name price _id productImage')
        .exec()
        .then(document => {
            console.log(document);
            if(document){
                res.status(200).json({
                    product: document,
                    //adding additional info to response json answer to make API more informative
                    request: {
                        type: "GET",
                        url: 'http://localhost:3000'
                    }
                });
            } else {
                res.status(404).json({ message: 'No valid entry found for provided ID' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    //request code in Postman
    // [
    //     { "propName": "something", "value": "something" }
    // ]
    //first argument is - what object by its _id will we change
    //second argument - how are we going to do this
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}