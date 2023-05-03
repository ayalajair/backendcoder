const {Schema, model} = require('mongoose');

const collection = 'carts'

const cartsSchema = new Schema({
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

const cartsModel = model(collection, cartsSchema);

module.exports = cartsModel;