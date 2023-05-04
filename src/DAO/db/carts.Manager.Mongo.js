const {cartModel} = require ('./models/cart.model')
const {productModel} = require ('./models/product.model')

class cartsManagerMongo {
    constructor() {}

//-------------ADD CART-------------------
    async addCart () {
        try {
            newCart = await cartModel.create({})
            return newCart
        } catch (error) {
            return new Error(error)
            
        }
    }
//-------------GET CARTS-----------------

    async getCarts () {
        try {
            return await cartModel.find()
        } catch (error) {
            return new Error(error)
        }
    }
//-------------GET CART BY ID--------------
    async getCartById (id) {
        try {
            const cart = await cartModel.findById(id)
            if(!cart){
                const respuesta = {
                    status:'not found',
                    message:'No se ha encontrado un carrito con ese ID',
                    success: false
                }
                return respuesta
            }
            const respuesta = {
                status: 'succes',
                message: 'Carrito encontrado',
                success: true,
                payload: cart
            }
            return respuesta
        }
        catch (error) {
            return new Error(error)
        }
    }

    async addToCart (cartId, productId,quantity) {
        try {
            const cart = await cartModel.findById(cartId)
            if(!cart){ 
                const respuesta = {
                    status:'not found',
                    message:'No se ha encontrado un carrito con ese ID',
                    success: false
                }
                return respuesta
            }
            const product = await productModel.findById(productId)

            if(!product){
                const respuesta = {
                    status:'not found',
                    message:'No se ha encontrado un producto con ese ID',
                    success: false
                }
                return respuesta
            }

            const toAddProduct = cart.products.find((p) => p.product.toString() === productId.toString())
            if (toAddProduct) {
                toAddProduct.quantity += quantity
            }
            cart.products.push({productId,quantity})
            await cart.save()
            const respuesta = {
                status: 'succes',
                message: 'Producto agregado al carrito',
                success: true,
                payload: cart
            }
            return respuesta
        }

        
        catch (error) {
            
        }
    }


}

module.exports = {cartsManagerMongo}