const express = require('express');
const router = express.Router();
const multer = require('multer');//to parse form data bodies
const checkAuth = require('../middleware/check-auth');//importing check-auth module (valid moddleware function)

const ProductsController = require('../controllers/products_controller');

//here we can setup the destination of the uploaded file and its name
//Multer will execute these functions autimatically (request, file, cb - callback)
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
});

//creating file filter to ejecting or accepting uploads
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'imgage/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

//const upload = multer({ dest: 'uploads/' });

const upload = multer({ 
    storage: storage, 
    limits: {
        filesize: 1024 * 1024 * 5 //limit 5 MB
    },
    fileFilter: fileFilter 
}); //passing configuration to multer
//this specifies a folder where the multer will try to store files and file name

//6. importing the productSchema
const Product = require('../models/product');

//get is the method which handles incoming get requiests
//its address is '/products', but we want to reach this directly
//uses '/' from the app.js
router.get('/', ProductsController.products_get_all);

//upload.single() is a middleware here which we connect to this router/function ? , it helps us to parse a file
router.post('/', checkAuth, upload.single('productImage'),ProductsController.products_create_product);

router.get('/:productId', ProductsController.products_get_one_product);

router.patch('/:productId', checkAuth, ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;