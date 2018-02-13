const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Product = require('../models/products');

const checkAuth = require('../middlewares/check-auth');

// Create Products
router.post('/createProduct', checkAuth, (req, res, next) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price
    });
    Product.find({ name: req.body.name })
        .exec()
        .then(respond => {
            if (respond.length >= 1) {
                console.log("Not");
                res.status(500).json({
                    done: false,
                    status: 500,
                    error: {
                        message: "This Product is registered"
                    }
                })
            } else {
                console.log("Save");
                product.save()
                    .then(result => {
                            res.status(200).json({
                                done: true,
                                status: 200,
                                product: result
                            })
                    })
                    .catch(err => {
                        res.status(404).json({
                            done: false,
                            error: {
                                message: err
                            }
                        })
                    });
            }
        })

});


// Get Products
router.get('/getAllProducts', (req, res, next) => {
    Product.find({})
        .select("name price _id")
        .exec()
        .then(results => {
            if (results.length >= 1) {
                res.status(200).json({
                    done: true,
                    status: 200,
                    count: results.length,
                    products: results,
                })
            } else {
                res.status(404).json({
                    done: true,
                        message: "There's No Producst Right Now"
                })
            }
        })
        .catch(err => {
            res.status(404).json({
                done: false,
                error: {
                    message: err
                }
            })
        })


});

// Get Specific Product
router.get('/getProduct/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select("name price _id")
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    done: true,
                    status: 200,
                    product: result
                });
            } else {
                res.status(404).json({
                    done: false,
                    error: {
                        message: "There's not product with this id"
                    }
                })
            }

        })
        .catch(err => {
            res.status(404).json({
                done: false,
                error: {
                    message: err
                }
            })
        })
})


// Update Specific Product 
router.patch('/updateProduct/:productId', checkAuth ,(req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).exec()
        .then(respond => {
            if (respond) {
                Product.update({ _id: id }, { $set: { name: req.body.name } })
                    .exec()
                    .then(result => {
                        if (result.nModified > 0 && result.n > 0) {
                            res.status(200).json({
                                done: true,
                                status: 200,
                                message: "Product Updated!",
                            })
                        } else {
                            res.status(404).json({
                                done: false,
                                error: {
                                    message: "Product is Not Updated"
                                }
                            })
                        }
                    })
                    .catch(err => {
                        res.status(404).json({
                            done: false,
                            error: {
                                message: err
                            }
                        })
                    });
            } else {
                res.status(403).json({
                    done: false,
                    status: 500,
                    error: {
                        message: "Can't Find this Product"
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                done: false,
                status: 500,
                error: {
                    message: err
                }
            })
        })


})

// Delete Specific Product
router.delete('/deleteProduct/:productId',checkAuth , (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).exec()
        .then(respond => {
            if (respond) {
                Product.remove({ _id: id })
                    .exec()
                    .then(result => {
                        if (result) {
                            res.status(200).json({
                                message: "Product Removed Successfully!",
                                done: true,
                                status: 200
                            })
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            done: false,
                            error: {
                                message: err
                            }                            
                        })

                    });
            } else {
                res.status(400).json({
                    done: false,
                    status: 400,
                    error: {
                        message: "Can't Find this product"
                    }
                })

            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                done: false,
                error: {
                    message: err,
                }
            })
        })



});

/* HELP Route */
router.get('/help/:unique', (req, res, next) => {
    const unique = req.params.unique;
    if (unique == "admin") {
        res.status(200).json({
            status: 200,
            apis: [{
                method: 'GET',
                url: "http://localhost:3000/products/getAllProducts",
                response: "JSON: { _id(mongoose.id) , count(number of products) , status(number: 200 => success) , name(string) , price(number) }",
                info: "GET All products"
            }, {
                method: 'GET',
                url: "http://localhost:3000/products/getProduct/:id",
                response: "JSON: { _id(mongoose.id), status(number: 200 => success) , name(string) , price(number) }",
                info: "GET Product"

            }, {
                method: 'POST',
                url: "http://localhost:3000/products/createProduct",
                body: "JSON: { product: mongoose.id , number: (number) }",
                response: "JSON: { _id(mongoose.id) , done([true , false]) , status([200(success) , ...]) , name(string) , price(number) }",
                info: "Create an Product"
            }, {
                method: 'PATCH',
                url: "http://localhost:3000/products/:id",
                body: "JSON: { number: (number) }",
                response: "JSON: { status:([ 200(success) , ... ]) , done: ([ true , false ]) , message:(string) }",
                info: "Update Number of Order"

            }, {
                method: 'DELETE',
                url: "http://localhost:3000/products/:id",
                response: "JSON: { status: ([ 200(success) , done: ([ true , falase ]) , message: (string) ]) }",
                info: "Delete Order"

            }]
        })
    } else {
        res.status(409).json({
            status: 409,
            message: 'Unauthoriazed'
        })
     
    }
})







module.exports = router;