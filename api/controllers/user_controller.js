const mongoose = require('mongoose'); //we need mongoose here to create id
const bcrypt = require('bcrypt'); //we need this to hash our password
const jwt = require('jsonwebtoken');//need this ti create a token

const User = require('../models/user');

exports.user_signup = (req, res, next) => {
    //check if user already exists with this email
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) { //if to put just 'user' but it doesn't exisi we will get 'null'. Anyway this conditional block will pass its first part
                res.status(409).json({
                    message: 'This email already exists'
                })
            } else {
                //creating user surrounding this in bcrypt method so we can hash our password
                bcrypt.hash(req.body.password, 10, (err, hash) => { // '10' - is a number of salting rounds (for random string which will be added to the encrypted password). 10 as amount means that is pretty safe.
                if (err) {
                    res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),//executed as a function to automaticaly generate id
                        email: req.body.email,
                        role: req.body.role,
                        password: hash
                    });
                    user
                        .save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'User created'
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({error: err});
                        }); //chaning 'catch' to catch errors
                    }
                }); 
            }
        })
    
}

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            //check if user email exists
            if(user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            //check the password to be correct (the hash to be the same)
            bcrypt.compare(req.body.password, user[0].password, (err, result) => { //'(err, result)' is a callback here
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if(result) {
                    // jwt.sign(payload, secretOfPrivatKey, [options, callback])
                    //payload - what data we want to pass into jwt.sign
                    //secretOfPrivatKey goes from nodemon.json
                    const token = jwt.sign(
                        { //payload
                            email: user[0].email,
                            userId: user[0]._id
                        }, 
                        'secret',//process.env.JWT_KEY, //secretOfPrivatKey
                        {  // options
                            expiresIn: "1h"
                        }
                        );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }
                res.status(401).json({
                    message: 'Auth failed'
                });
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}

exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted',
                result: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

