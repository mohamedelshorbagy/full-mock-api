const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');


const app = express();
const port = 3000;


// MiddleWare
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


// Connect to Database ==> [ MongoDB ]
mongoose.connect(config.database);


mongoose.connection.on('connected' , () => {

    console.log('Database is Running in localhost:27017');

})

// Routes
const usersRoute = require('./api/routes/users');
const productsRoute = require('./api/routes/products');
const ordersRoute = require('./api/routes/orders');

// Call Routes
app.use('/users' , usersRoute);
app.use('/products' , productsRoute);
app.use('/orders' , ordersRoute);

// Setup the Errors Handlers 

app.use((req , res , next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);

})

app.use((error , req , res , next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message:error.message
        } 
    });

})

// Initializing the Port
app.listen(port,() => {
    console.log(`App is Running in Port ${port}`);
})





