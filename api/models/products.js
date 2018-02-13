const mongoose = require('mongoose');


const ProductSchema = mongoose.Schema({

    name: { type: String , required: true },
    price: { 
        type: Number , 
        required: true , 
        match: /^[0-9]+$/ 
    }

})


const Product = mongoose.model('Product' , ProductSchema);

module.exports = Product;