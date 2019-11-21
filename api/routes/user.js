const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');//importing check-auth module (valid moddleware function)

const UserController = require('../controllers/user_controller');

// jwt.sign(payload, secretOfPrivatKey, [options, callback])
//payload - data which we want to pass into the function sign
//secretOfPrivatKey - the key which is known only by the server
//callback is executed when the sign is done

//we need here two routes: for SignUp and SignIn
//we don't need LogOut route because RESTfull API doesn't store the session

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);


router.delete('/:userId', checkAuth, UserController.user_delete);


module.exports = router;