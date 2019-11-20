const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); //we need mongoose here to create id
const bcrypt = require('bcrypt'); //we need this to hash our password

const User = require('../models/user');

//we need here two routes: for SignUp and SignIn
//we don't need LogOut route because RESTfull API doesn't store the session

router.post('/signup', (req, res, next) => {
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
    
});


router.delete('/:userId', (req, res, next) => {
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
});


module.exports = router;