const EventEmitter = require('events');
const {productModel} = require('./models/product.model')

class ProductManagerMongo {
    constructor() {
        this.events = new EventEmitter
    }

//-------------GET PRODUCTS----------------
    async getProducts(limit = null) {
        try {
            return await productModel.find().limit(limit)
        } catch (error) {
            return new Error(error)
        }
    }
//--------------GET PRODUCT BY ID-------------
    async getProductById(id){
        try {
            return await productModel.findById(id)
        } catch (error) {
            return new Error(error)
        }
    }

//-------------ADD PRODUCT----------------
    async addProduct(product){
        try {
            //Validamos que cada el objeto tenga todas las propiedades
            if (!product.hasOwnProperty('title') ||
            !product.hasOwnProperty('description') ||
            !product.hasOwnProperty('code') ||
            !product.hasOwnProperty('price') ||
            !product.hasOwnProperty('stock') ||
            !product.hasOwnProperty('category')) {
            const respuesta = {
                status: 'error',
                message: 'El producto no tiene todas las propiedades requeridas',
                success: false};
            return respuesta
            }
            // Validamos el tipo de cada propiedad
            if (typeof product.title !== 'string' ||
            typeof product.description !== 'string' ||
            typeof product.code !== 'string' ||
            typeof product.price !== 'number' ||
            typeof product.stock !== 'number' ||
            typeof product.category !== 'string'
            //||!Array.isArray(product.thumbnails)
            ) {
            const respuesta = {
            status: 'error',
            message: 'El producto tiene una o más propiedades con un tipo incorrecto',
            succes:false}
            return respuesta
            }
            //Validamos que el producto no exista
            if (await productModel.exists({code: product.code})) {
            const respuesta = {
                status: 'error',
                message: 'Ya se ha ingresado un producto con ese código',
                success: false};
            return respuesta
            }
            this.events.emit('addProduct', product).setMaxListeners()
            return await productModel.create(product)
        } catch (error) {
            return new Error(error)
        }
    }
//-------------UPDATE PRODUCT-------------
    async  updateProduct(id, product){
        try {
            return await productModel.findOneAndUpdate({_id: id}, product)
        }catch (error) {
            return new Error(error)
        }
    }

//-------------DELETE PRODUCT-------------
    async deleteProduct(id){
        try {
            deletedProduct = await productModel.findOneAndDelete({_id: id})
            this.events.emit('deleteProduct', id).setMaxListeners()
            return deletedProduct
        }catch (error) {
            return new Error(error)
        }
    }

}

module.exports = ProductManagerMongo;