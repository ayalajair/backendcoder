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
            const cart = await cartModel.findOne({_id:cartId})
            
            if(!cart){ 
                const respuesta = {
                    status:'not found',
                    message:'No se ha encontrado un carrito con ese ID',
                    success: false
                }
                return respuesta
            }
            const product = await productModel.findOne({_id:productId})
            
            if(!product){
                const respuesta = {
                    status:'not found',
                    message:'No se ha encontrado un producto con ese ID',
                    success: false
                }
                return respuesta
            }

            const toAddProductIndex = cart.products.findIndex((p) => p.product.toString() === productId.toString())
            
            
            
            if (toAddProductIndex === -1) {
                cart.products.push({
                    product:productId,
                    quantity:quantity})
                console.log(cart)
                const respuesta = {
                    status: 'succes',
                    message: 'Producto agregado al carrito',
                    success: true,
                    payload: cart
                }
                await cart.save()
    
                return respuesta }

            const toAddProduct = cart.products[toAddProductIndex]
            toAddProduct.quantity += quantity
            cart.products[toAddProductIndex] = toAddProduct
            
            await cart.save()
            const respuesta = {
                status: 'succes',
                message: 'Producto agregado al carrito',
                success: true,
                payload: cart
            }
            console.log(cart)
            return respuesta
        }
        catch (error) {
            return new Error(error)
        }
    }
//-------------DELETE CART--------------

    async deleteCart (id) {
        try {
            const deleteCart = await cartModel.findByIdAndDelete(id)
            if(!deleteCart){
                const respuesta = {
                    status:'not found',
                    message:'No se ha encontrado un carrito con ese ID',
                    success: false
                }
                return respuesta
            }

            const respuesta = {
                status: 'succes',
                message: 'Carrito eliminado',
                payload: deleteCart,
                success: true}
            return respuesta

        } catch (error) {
            return new Error(error)
        }
    }
//-------------DELETE PRODUCT--------------

    async deleteProduct (cartId, productId) {
        try {
            const cart = await cartModel.findOne({_id:cartId})
            if(!cart){return new Error('No se ha encontrado un carrito con ese ID')}
            const product = await productModel.findOne({_id:productId})
            if(!product){return new Error('No se ha encontrado un producto con ese ID')}
            const toDeleteProductIndex = cart.products.findIndex((p) => p.product.toString() === productId.toString())
            if (toDeleteProductIndex === -1) {return new Error('No se ha encontrado ese producto en el carrito')}
            cart.products.splice(toDeleteProductIndex,1)
            await cart.save()
            const respuesta = {
                status: 'succes',
                message: 'Producto eliminado del carrito',
                payload: cart,
                success: true}
            return respuesta
        }
         catch (error) {
            return new Error(error)
        }
    }
}

module.exports = {cartsManagerMongo}