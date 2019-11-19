const express = require('express');
const router = express.Router();

//get is the method which handles incoming get requiests
//its address is '/products', but we want to reach this directly
//uses '/' from the app.js
//argument 'next' (which is the arrow function) pushes our request to the next 
//middlewqre line
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET request to /products'
    }); //sending json response (can check it using Post software)
})

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Handling POST request to /products'
    }); //sending json response
})

router.get('/:productId', (req, res, next) => {
    //we get params here from incoming request
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        })
    } else {
        res.status(200).json({
            message: 'You passed an ID',
            id: id
        })
    }
})

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product'
    })
})

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product'
    })
})

module.exports = router;