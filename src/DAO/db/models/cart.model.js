const {Schema, model} = require('mongoose');

const collection = 'carts'

const cartSchema = new Schema({
    products: [{
        _id: false,
        quantity: {
            required: true,
            type: Number},
        product: {
            type: String,
            required: true
        }
        
    }]
})

const cartModel = model(collection, cartSchema);

module.exports = {cartModel}