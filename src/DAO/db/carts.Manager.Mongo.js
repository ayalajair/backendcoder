
const { CustomError } = require('../../utils/CustomError/CustomError')
const { EError } = require('../../utils/CustomError/EErrors')
const { findCartErrorInfo, findCartsErrorInfo, findProductErrorInfo, findProductInCartErrorInfo, updateCartErrorInfo } = require('../../utils/CustomError/info')
const {cartModel} = require ('./models/cart.model')
const {productModel} = require ('./models/product.model')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

class cartsManagerMongo {
    constructor() {}

//-------------ADD CART-------------------
    async addCart () {
        try {
            let newCart = await cartModel.create({})
            if(!newCart){
                CustomError.createError({
                    name: 'Add cart error',
                    cause: addCartErrorInfo(),
                    message: 'Error trying to add Cart',
                    code: EError.NOT_FOUND,
                })
            }
            return newCart._id
        } catch (error) {
            throw error
            
        }
    }
//-------------GET CARTS-----------------

    async getCarts () {
        try {
            const carts = await cartModel.find().populate('products.product').lean()
            if(!carts){
                CustomError.createError({
                    name: 'Find carts error',
                    cause: findCartsErrorInfo(),
                    message: 'Error trying to find Carts',
                    code: EError.NOT_FOUND,
                })
            
            }
            return 
        } catch (error) {
            throw error
        }
    }
//-------------GET CART BY ID--------------
    async getCartById (id) {
        try {
            const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null
            const cart = await cartModel.findById(objectId).populate('products.product').lean()
            console.log("cart",cart)
            if(!cart){
                CustomError.createError({
                    name: 'Find cart error',
                    cause: findCartErrorInfo(id),
                    message: 'Error trying to find Cart',
                    code: EError.NOT_FOUND,
                })
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
            throw error
        }
    }
//------------- ADD  PRODUCT TO CART--------------
    async addToCart (cartId, productId,quantity) {
        try {
            const cart = await cartModel.findOne({_id:cartId}).populate('products.product')
            
            if(!cart){ 
                CustomError.createError({
                    name: 'Find cart error',
                    cause: findCartErrorInfo(id),
                    message: 'Error trying to find Cart',
                    code: EError.NOT_FOUND,
                })
            }
            const product = await productModel.findOne({_id:productId})
            
            if(!product){
                CustomError.createError({
                    name: 'Find product error',
                    cause: findProductErrorInfo(productId),
                    message: 'Error trying to find Product',
                    code: EError.NOT_FOUND,
                })
            }

            const toAddProductIndex = cart.products.findIndex((p) => p.product._id.toString() === productId.toString())
            
            
            
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
            
            const populatedCart = await cartModel.findOne({ _id: cart._id }).populate('products.product')
            console.log(populatedCart)

            const respuesta = {
                status: 'succes',
                message: 'Producto agregado al carrito',
                success: true,
                payload: populatedCart
            }

            return respuesta
        }
        catch (error) {
            throw error
        }
    }
//-------------DELETE CART--------------

    async deleteCart (id) {
        try {
            const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null
            const deleteCart = await cartModel.findByIdAndDelete(objectId)
            if(!deleteCart){
                CustomError.createError({
                    name: 'Delete cart error',
                    cause: findCartErrorInfo(id),
                    message: 'Error trying to delete Cart',
                    code: EError.NOT_FOUND,
                })
            }

            const respuesta = {
                status: 'succes',
                message: 'Carrito eliminado',
                payload: deleteCart,
                success: true}
            return respuesta

        } catch (error) {
            console.log(error)
            
            throw error
        }
    }
//-------------DELETE PRODUCT--------------

    async deleteFromCart (cartId, productId) {
        try {
            const cart = await cartModel.findOne({_id:cartId})
            if(!cart){
                CustomError.createError({
                    name: 'Find cart error',
                    cause: findCartErrorInfo(cartId),
                    message: 'Error trying to find Cart',
                    code: EError.NOT_FOUND,
                })
            }
            const product = await productModel.findOne({_id:productId})
            if(!product){
                CustomError.createError({
                    name: 'Find product error',
                    cause: findProductErrorInfo(productId),
                    message: 'Error trying to find Product',
                    code: EError.NOT_FOUND,
                })
            }
            const toDeleteProductIndex = cart.products.findIndex((p) => p.product.toString() === productId.toString())
            if (toDeleteProductIndex === -1) {
                CustomError.createError({
                    name: 'Delete product error',
                    cause: findProductInCartErrorInfo(productId),
                    message: 'Error trying to delete Product',
                    code: EError.NOT_FOUND,
                })
            }
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
            throw error
        }
    }

    //-----------UPDATE CART-------------

    async updateCart (id, cart) {
        try {
            const { cid, products } = cart
            if(!cid||!products){
                CustomError.createError({
                    name: 'Update cart error',
                    cause: updateCartErrorInfo(id, cart),
                    message: 'Error trying to update Cart',
                    code: EError.INVALID_TYPE_ERROR,
                })
            }
            const updateCart = await cartModel.findByIdAndUpdate({_id:id}, cart)
            if(!updateCart){
                CustomError.createError({
                    name: 'Update cart error',
                    cause: findCartErrorInfo(id),
                    message: 'Error trying to update Cart',
                    code: EError.NOT_FOUND,
                })
            }
            const respuesta = {
                status: 'succes',
                message: 'Carrito actualizado',
                payload: updateCart,
                success: true}
            return respuesta
        } catch (error) {
            throw error
        }
    
    }

    //-----------UPDATE CART PRODUCT-------------
    async updateCartProduct (cartId, productId, quantity) {
        try {
            //Validamos que el carrito exista
            const cart = await cartModel.findOne({_id:cartId})
            if(!cart) {
                CustomError.createError({
                    name: 'Update cart product error',
                    cause: findCartErrorInfo(cartId),
                    message: 'Error trying to update Cart Product',
                    code: EError.NOT_FOUND,
                })
            }
            //Validamos que el producto exista
            const product = await productModel.findOne({_id:productId})
            if(!product){
                CustomError.createError({
                    name: 'Update cart product error',
                    cause: findProductErrorInfo(productId),
                    message: 'Error trying to update Cart Product',
                    code: EError.NOT_FOUND,
                })
            }
            //Validamos que el producto este en el carrito
            const toUpdateProductIndex = cart.products.findIndex((p) => p.product.toString() === productId.toString())
            if (toUpdateProductIndex === -1) {
                CustomError.createError({
                    name: 'Update cart product error',
                    cause: findProductInCartErrorInfo(productId),
                    message: 'Error trying to update Cart Product',
                    code: EError.NOT_FOUND,
                })
            }
            cart.products[toUpdateProductIndex].quantity = quantity
            await cart.save()
            const respuesta = {
                status: 'succes',
                message: 'Producto actualizado',
                payload: cart,
                success: true
            }
            return respuesta    

        } catch (error) {
            throw error
        }
    }
}

module.exports = {cartsManagerMongo}