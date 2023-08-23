const { logger } = require('../config/logger')
const {cartsService, productsService, ticketsService} = require('../service/index')
const { CustomError } = require('../utils/CustomError/CustomError')

const { EError } = require('../utils/CustomError/EErrors')
const { updateQuantityErrorInfo, addProductToCartErrorInfo } = require('../utils/CustomError/info')


class CartsController {

    getCarts = async (req,res,next)=>{
        try {
            const allCarts = await cartsService.getCarts()
            res.status(200).send(allCarts)
        } catch (error) {
            next (error)
        }
    }

    getCartById = async (req,res,next)=>{
        try{
            const {cid} = req.params
            const cart = await cartsService.getCartById(cid)
            logger.info('Cart found')
            res.status(200).send(cart)
        }catch(error){
            next (error)
        }
    }

    addCart = async (req,res,next)=>{
        try{
            const cart = await cartsService.addCart() 
            logger.info('Cart created')
            res.status(200).send({cart})
        
        } catch(error){
            next (error)
        
        }
    }

    addToCart = async (req,res, next)=>{
        try{
            const {cid,pid} = req.params
            console.log(req.user)
            if(req.user.role === 'premium') {
                const product = await productsService.getProductById(pid)
                if(product.owner === req.user._id) {
                    CustomError.createError({
                        name: 'Product owner',
                        cause: addProductToCartErrorInfo(product._id),
                        message: 'Product owner cannot add to cart his/her own product',
                        code: EError.INVALID_TYPE_ERROR
                    })
                }    
            }
            console.log(cid , pid)
            const updatedCart = await cartsService.addToCart(cid, pid, 1)
            logger.info('Product added to cart')
            res.status(200).send(updatedCart)
        }catch (error){
            next (error)
        
        }
    }

    updateCart = async (req,res,next)=>{
        try {
            const {cid} = req.params
            const cart = req.body
            const updatedCart = await cartsService.updateCart(cid, cart)
            logger.info('Cart updated')
            res.status(200).send(updatedCart)
        } catch (error) {
            next (error)
        
        }
    }

    updateCartProduct = async (req,res,next)=>{
        try {
            const {cid,pid} = req.params
            const {quantity} = req.body
            console.log(cid,pid,quantity)
            if(!quantity|| quantity < 1 || isNaN(quantity)) {
                CustomError.createError({
                    name: 'No quantity provided',
                    cause: updateQuantityErrorInfo(quantity),
                    message: 'No quantity provided',
                    code: EError.INVALID_TYPE_ERROR
                })
            }
            const updatedCart = await cartsService.updateCartProduct(cid,pid,quantity)
            logger.info('Product updated')
            res.status(200).send(updatedCart)
        } catch (error) {
            next (error)
        }
    }

    deleteCart = async (req,res,next)=>{
        try {
            const {cid} = req.params
            const deletedCart = await cartsService.deleteCart(cid)
            logger.info('Cart deleted')
            res.status(200).send(deletedCart)
        }
        catch (error) {
            next (error)
        
        }
    }

    deleteFromCart = async (req,res,next)=>{
        try {
            const {cid,pid} = req.params
            const deletedProduct = await cartsService.deleteFromCart(cid,pid)
            logger.info('Product deleted from cart')
            res.status(200).send(deletedProduct)
        } catch (error) {
            next (error)
        }
    }

    purchase = async (req,res, next)=>{
        try {
            const {cid} = req.params
            
            const cart = await cartsService.getCartById(cid)
            if(!cart.success) {
                res.status(404).send(cart)
            }

            if(!cart.payload.products.length) {
                res.status(404).send({status:'Router',error:'El carrito está vacío'})
            }

            const user = req.user
            console.log('usuario',user)

            const productsNotPurchased = []
            const productsPurchased = []
            for (const item of cart.payload.products){
                const product = item.product
                const quantity = item.quantity
                const stock = item.product.stock
                if(stock < quantity){
                    productsNotPurchased.push({
                        quantity: quantity,
                        product: product
                    })
                } else {
                    await productsService.update(product._id,{stock: stock - quantity})
                    productsPurchased.push({
                        quantity: quantity,
                        product: product})
                    }
            }
            logger.info(`carrito antes de actualizar: ${cart}`)
            logger.info(`productos no vendidos: ${productsNotPurchased}`)
            logger.info(`productos vendidos',${productsPurchased}`)
            const ticket = await ticketsService.createTicket(productsPurchased,user.email)
            const updatedCart = {
                ...cart.payload,
                products: productsNotPurchased.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity
                }))
            };
            await cartsService.updateCart(cart.payload._id, updatedCart)
            logger.info(`Carrito nuevo: ${updatedCart}`)
            res.status(200).send({status:'Success',payload:{ticket, updatedCart}})
        } catch (error) {
            next (error)
        }
    }
}



module.exports = new CartsController()

