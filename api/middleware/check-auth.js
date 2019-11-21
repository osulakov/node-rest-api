//after we create this middleware we need to add it to the routes to check if they can be accessed by unauthorized user
// we use jwt.verify(token, secretOfPublicKey, [options, callback]). (or we dont need callback if we do like const xx = jwt.verify(token, secretOfPublicKey, options))

const jwt = require('jsonwebtoken');


//here we use default niddleware pattern
//for the tests in the Postman we put token into header abd use keyword 'Bearer' in the front 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        next();
    } catch(error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }  
};