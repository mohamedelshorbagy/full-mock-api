const express = require('express');
const router = express.Router();



router.post('/' , (req , res , next) => {
    res.status(200).json({
        message: "Welcome From Users",
        body: req.body
    });
})




module.exports = router;