const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Product = require('../models/products');

// Create Products
router.post('/', (req, res, next) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price
    });
    product.save()
        .select("name price _id")
        .then(result => {
            if (result) {
                res.status(200).json({
                    product: result
                })
            } else {
                res.status(404).json({
                    error: {
                        message: "Product wasn't created, Something Went Worng,try again later"
                    }
                })
            }
        })
        .catch(err => {
            res.status(404).json({
                error: {
                    message: err
                }
            })
        });


});


// Get Products
router.get('/', (req, res, next) => {
    Product.find({})
        .select("name price _id")
        .exec()
        .then(results => {
            if (results.length >= 1) {
                res.status(200).json({
                    count: results.length,
                    products: results,
                })
            } else {
                res.status(404).json({
                    error: {
                        message: "There's Not Producst Right Now"
                    }
                })
            }
        })
        .catch(err => {
            res.status(404).json({
                error: {
                    message: err
                }
            })
        })


});

// Get Specific Product
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select("name price _id")
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    product: result
                });
            } else {
                res.status(404).json({
                    error: {
                        message: "There's not product with this id"
                    }
                })
            }

        })
        .catch(err => {
            res.status(404).json({
                error: {
                    message: err
                }
            })
        })
})


// Update Specific Product 
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.update({ _id: id }, { $set: { name: req.body.name } })
        .exec()
        .then(result => {
            if (result.nModified > 0 && result.n > 0) {
                res.status(200).json({
                    message: "Product Updated!",
                })
            } else {
                res.status(404).json({
                    error: {
                        message: "Product is Not Updated"
                    }
                })
            }
        })
        .catch(err => {
            res.status(404).json({
                error: {
                    message: err
                }
            })
        });

})

// Delete Specific Product
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "Product Removed Successfully!",
                    data: [{
                        method: 'POST',
                        url: "http://localhost:3000/products",
                        body: "JSON: [ name(string) , price(number) ]",
                        info: "Create New Product"
                    }, {
                        method: 'GET',
                        url: "http://localhost:3000/products",
                        info: "Get All Products in Database"
                    }, {
                        method: 'GET',
                        url: "http://localhost:3000/products/:id",
                        info: "Get Specific Product from its id"
                    }, {
                        method: 'DELETE',
                        url: "http://localhost:3000/products/:id",
                        info: "Remove Specific Product from its id"
                    }, {
                        method: 'PATCH',
                        url: "http://localhost:3000/products/:id",
                        body: "JSON: name(string)",
                        info: "Update Specific Product from its id"
                    }]
                })
            }
        })
        .catch(err => {
            error: {
                message: err
            }
        });


});







module.exports = router;