const express = require('express');
const router = express.Router();


const User = require('../models/users');


// Create User
router.post('/', (req, res, next) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    user.save()
        .select("email password _id")
        .then(result => {
            if (result) {
                res.status(200).json({
                    user: result
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


// Get All USers
router.get('/', (req, res, next) => {
    User.find({})
        .select("email password _id")
        .exec()
        .then(users => {
            if (users.length > 1) {
                res.status(200).json({
                    count: users.length,
                    users
                })
            } else {
                res.status(500).json({
                    message: "There's No Users Right Now"
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

})


// Get Only On User
router.get('/:userId', (res, req, next) => {
    User.findById(req.params.userId)
        .select("email password _id")
        .exec()
        .then(user => {
            if (user) {
                res.status(200).json({
                    user: user
                })
            } else {
                res.status(404).json({
                    message: "There's No a User with Such Id"
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
})



// Updating User
router.patch('/:userId', (req, res, next) => {
    User.update({ _id: req.params.userId }, { $set: { email: req.body.email } })
        .select("email password _id")
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User is Updated!"
            })
        })
        .catch(err => {
            res.status(500).json({
                error: {
                    message: err
                }
            })
        })
})


// Deleting User
router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "User is Deleted"
                })
            } else {
                res.status(501).json({
                    message: "Something Went Wrong, Try Again Later"
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



})





module.exports = router;