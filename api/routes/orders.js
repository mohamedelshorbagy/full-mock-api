const express = require('express');
const router = express.Router();

const Order = require('../models/orders');

const checkAuth = require('../middlewares/check-auth');

/* Create Order */
router.post('/createOrder',checkAuth , (req, res, next) => {
    const order = new Order({
        product: req.body.product,
        number: req.body.number
    });

    order
        .save()
        .then(result => {
            res.status(200).json({
                status: 200,
                done: true,
                message: 'User Created',
                order: result
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                done: false,
                error: {
                    message: err
                }
            })
        })

})


/* GET Orders */
router.get('/getAllOrders',checkAuth , (req, res, next) => {
    Order
        .find({})
        .select('_id product number')
        .populate('product', '_id name price')
        .exec()
        .then(result => {
            if (result.length >= 1) {
                res.status(200).json({
                    done: true,
                    status: 200,
                    count: result.length,
                    orders: result
                })
            } else {
                res.status(200).json({
                    status: 200,
                    done: true,
                    message: 'There\'s no orders right now'
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
        })

})


/* GET Single Order */
router.get('/getOrder/:orderId',checkAuth , (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .select("_id product number")
        .populate('product', "_id name price")
        .exec()
        .then(result => {
            res.status(200).json({
                status: 200,
                done: true,
                order: result
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                done: false,
                error: {
                    message: err
                }
            })
        })

})


/* Update Order */
router.patch('/updateOrder/:orderId',checkAuth , (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id).exec()
        .then(respond => {
            if (respond) {
                Order.update({ _id: id }, { $set: { number: req.body.number } })
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            status: 200,
                            done: true,
                            message: "Order Updated"
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            status: 500,
                            done: false,
                            error: {
                                message: err
                            }
                        })
                    })
            } else {
                res.status(400).json({
                    done: false,
                    status: 400,
                    error: {
                        message: "This Order is not found"
                    }
                })

            }
        }).catch(err => {
            res.status(500).json({
                done: false,
                status: 500,
                error: {
                    message: err
                }
            })
        })

})

/* Delete Order */
router.delete('/deleteOrder/:orderId',checkAuth , (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id).exec()
        .then(respond => {
            if (respond) {
                Order.remove({ _id: id })
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            status: 200,
                            done: true,
                            message: "Order is Deleted Successfully"
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            status: 500,
                            done: false,
                            error: {
                                message: err
                            }
                        })
                    })
            } else {
                res.status(500).json({
                    status: 500,
                    done: false,
                    error: {
                        message: "This Order is not Found"
                    }
                })
            }
        })



})

/* HELP API  */
router.get('/help/:unique', (req, res, next) => {
    const unique = req.params.unique;
    if (unique == "admin") {
        res.status(200).json({
            status: 200,
            apis: [{
                method: 'GET',
                url: "http://localhost:3000/orders/getAllOrders",
                response: "JSON: { _id(mongoose.id) , count(number of orders) , status(number: 200 => success) , number(number) , product(number) }",
                info: "GET All Orders"
            }, {
                method: 'GET',
                url: "http://localhost:3000/orders/getOrder/:id",
                response: "JSON: { _id(mongoose.id), status(number: 200 => success) , number(number) , product(number) }",
                info: "GET Order"

            }, {
                method: 'POST',
                url: "http://localhost:3000/orders/createOrder",
                body: "JSON: { product: mongoose.id , number: (number) }",
                response: "JSON: { _id(mongoose.id) , done([true , false]) , status([200(success) , ...]) , number(number) , product(number) }",
                info: "Create an Order"
            }, {
                method: 'PATCH',
                url: "http://localhost:3000/orders/:id",
                body: "JSON: { number: (number) }",
                response: "JSON: { status:([ 200(success) , ... ]) , done: ([ true , false ]) , message:(string) }",
                info: "Update Number of Order"

            }, {
                method: 'DELETE',
                url: "http://localhost:3000/orders/:id",
                response: "JSON: { status: ([ 200(success) , done: ([ true , falase ]) , message: (string) ]) }",
                info: "Delete Order"

            }]
        })
    } else {
        res.status(409).json({
            status: 409,
            error: {
                message: 'Unauthoriazed'
            }
        })

    }
})



module.exports = router;