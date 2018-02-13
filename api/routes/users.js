const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();


const User = require('../models/users');


const checkAuth = require('../middlewares/check-auth');

// Create User
router.post('/createUser', (req, res, next) => {

    User.find({ email: req.body.email }).exec()
        .then(respond => {
            if (respond.length >= 1) {
                res.status(409).json({
                    done: false,
                    error: {
                        message: "This User is Already Registered"
                    }
                })
            } else {
                const encryptedPassword = bcrypt.hash(req.body.password, 10, (error, hash) => {
                    if (error) {
                        res.status(500).json({
                            done: false,
                            error: {
                                message: error
                            }
                        })
                    } else {
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                if (result) {
                                    res.status(200).json({
                                        done: true,
                                        status: 200,
                                        message: "User Created Successfully!"
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

                    }
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

});

// Add Product To User
router.patch('/updateUserOrders/:userId', checkAuth, (req, res, next) => {
    const id = req.params.userId;
    User.update({ _id: id }, { $set: { orders: req.body.orders } })
        .select("_id email orders")
        .exec()
        .then(result => {
            res.status(200).json({
                done: true,
                status: 200,
                message: "Orders Are Added"
            })
        })
        .catch(err => {
            res.status(500).json({
                done: false,
                error: {
                    message: err
                }
            })
        })

});


// Get All Users
router.get('/getAllUsers', checkAuth, (req, res, next) => {
    User.find({})
        .select("email _id orders")
        .populate({ path: 'orders', select: { 'number': 1, 'product': 1 }, populate: { path: 'product', select: { 'name': 1, 'price': 1 } } })
        .exec()
        .then(users => {
            if (users.length >= 1) {
                res.status(200).json({
                    done: true,
                    status: 200,
                    count: users.length,
                    users
                })
            } else { // Should Be Handled From Front-End
                res.status(500).json({
                    done: true,
                    message: "There's No Users Right Now"
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

})


// Get Only On User
router.get('/getUser/:userId', checkAuth, (res, req, next) => {
    User.findById(req.params.userId)
        .select("email orders")
        .populate({ path: 'orders', select: { 'number': 1, 'product': 1 }, populate: { path: 'product', select: { 'name': 1, 'price': 1 } } })
        .exec()
        .then(user => {
            if (user) {
                res.status(200).json({
                    done: true,
                    status: 200,
                    user: user
                })
            } else {
                res.status(404).json({
                    done: false,
                    error: {
                        message: "There's No a User with Such Id"
                    }
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
})



// Updating User
router.patch('/updateUser/:userId', checkAuth, (req, res, next) => {
    User.update({ _id: req.params.userId }, { $set: { email: req.body.email } })
        .select("email orders _id")
        .exec()
        .then(result => {
            res.status(200).json({
                done: true,
                status: 200,
                message: "User is Updated!"
            })
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


// Deleting User
router.delete('/deleteUser/:userId', checkAuth, (req, res, next) => {
    const id = req.params.userId;
    User.findById(id).exec()
        .then(respond => {
            if (respond) {
                User.remove({ _id: req.params.userId })
                    .exec()
                    .then(result => {
                        if (result) {
                            res.status(200).json({
                                done: true,
                                status: 200,
                                message: "User is Deleted Successfully"
                            })
                        } else {
                            res.status(501).json({
                                done: false,
                                error: {
                                    message: "Something Went Wrong, Try Again Later"
                                }
                            })
                        }

                    })
                    .catch(err => {
                        res.status(500).json({
                            error: {
                                message: err
                            }
                        })
                    });

            } else {
                res.status(409).json({
                    done: false,
                    error: {
                        message: "This User Can't Be Found"
                    }
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


router.post('/login', (req, res, next) => {
    const email = req.body.email;
    User.find({ email: email })
        .exec()
        .then(result => {
            if (result.length >= 1) {
                const password = req.body.password;
                bcrypt.compare(password, result[0].password, (error, respond) => {
                    if (error) {
                        return res.status(422).json({
                            done: false,
                            error: {
                                message: "Email or Password are Worng"
                            }
                        })
                    } else {
                        if (respond === true) {
                            const token = jwt.sign({
                                email: result[0].email,
                                id: result[0]._id
                            }, 'secret', {
                                    expiresIn: '2h'
                                })
                            return res.status(200).json({
                                done: true,
                                status: 200,
                                message: "You Are Logged In Successfully",
                                token: token
                            })
                        } else {
                            return res.status(422).json({
                                done: false,
                                error: {
                                    message: "Email or Password are Worng"
                                }
                            })

                        }
                    }
                })

            } else {
                res.status(500).json({
                    done: false,
                    error: {
                        message: "Email or Password are Worng"
                    }
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



/* HELP Route */
router.get('/help/:unique', (req, res, next) => {
    const unique = req.params.unique;
    if (unique == "admin") {
        res.status(200).json({
            status: 200,
            apis: [{
                method: 'GET',
                url: "http://localhost:3000/users/getAllUsers",
                response: "JSON: { _id(mongoose.id) , count(number of users) , status(number: 200 => success) , email(string) , products(array) }",
                info: "GET All users"
            }, {
                method: 'GET',
                url: "http://localhost:3000/users/getUser/:id",
                response: "JSON: { _id(mongoose.id), status(number: 200 => success) , email(string) , products(array) }",
                info: "GET Product"

            }, {
                method: 'POST',
                url: "http://localhost:3000/users/createUser",
                body: "JSON: { product: mongoose.id , number: (number) }",
                response: "JSON: { _id(mongoose.id) , done([true , false]) , status([200(success) , ...]) , email(string) , products(array) }",
                info: "Create an Product"
            }, {
                method: 'POST',
                url: "http://localhost:3000/users/login",
                body: "JSON: { email: (string) , password: (string) }",
                response: "JSON: { done([true , false]) , status([200(success) , ...]) , token}",
                info: "Login"
            }, {
                method: 'PATCH',
                url: "http://localhost:3000/users/:id",
                body: "JSON: { number: (number) }",
                response: "JSON: { status:([ 200(success) , ... ]) , done: ([ true , false ]) , message:(string) }",
                info: "Update Number of Order"

            }, {
                method: 'PATCH',
                url: "http://localhost:3000/updateUserOrders/:id",
                body: "JSON: { orders: [ orders: mongoose.id ] }",
                response: "JSON: { status:([ 200(success) , ... ]) , done: ([ true , false ]) , message:(string) }",
                info: "Update User Orders"

            }, {
                method: 'DELETE',
                url: "http://localhost:3000/users/:id",
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