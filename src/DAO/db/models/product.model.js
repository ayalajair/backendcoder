/// Esquema
const {Schema, model} = require ('mongoose')

const collection = 'products'

const  productSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    price:  {type: Number, required: true},
    thumbnail: {type: [String]},
    stock: {type: Number, required: true},
    code: {type: String, required: true, unique: true},
})

const productModel = model(collection, productSchema)

module.exports = {
    productModel
}
