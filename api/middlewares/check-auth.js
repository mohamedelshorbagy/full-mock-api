const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // JWT <akjsdnkashbdausbda>
        const decoded = jwt.verify(token, 'secret')
        next();

    } catch (error) {
        return res.status(401).json({
            done: false,
            error: {
                message: "Unauthenticated"
            }
        })
    }
}