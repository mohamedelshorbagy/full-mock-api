const mongoose = require('mongoose');



const OrderSchema = mongoose.Schema({
    number : { type: Number , default: 1 , match: /^[0-9]+$/},
    product: { type: mongoose.Schema.Types.ObjectId , required: true , ref: 'Product' },
});

const Order = mongoose.model('Order' , OrderSchema);

module.exports = Order;