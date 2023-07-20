const {cartsService, productsService, ticketsService} = require('../service/index')
const CustomError = require('../utils/CustomError/CustomError')
const { EError } = require('../utils/CustomError/EErrors')
const { updateQuantityErrorInfo } = require('../utils/CustomError/info')


class CartsController {

    getCarts = async (req,res,next)=>{
        try {
            const allCarts = await cartsService.getCarts()
            res.status(200).send({status:'Success',payload:allCarts})
        } catch (error) {
            next (error)
        }
    }

    getCartById = async (req,res,next)=>{
        try{
            const {cid} = req.params
            const cart = await cartsService.getCartById(cid)
            res.status(200).send(cart)
        }catch(error){
            next (error)
        }
    }

    addCart = async (req,res,next)=>{
        try{
            const cart = await cartsService.addCart() 
            res.statussend({status: 'Success', payload: cart})
        } catch(error){
            next (error)
        
        }
    }

    addToCart = async (req,res, next)=>{
        try{
            const {cid,pid} = req.params 
            const updatedCart = await cartsService.addToCart(cid, pid, 1)
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
            res.status(200).send(updatedCart)
        } catch (error) {
            next (error)
        
        }
    }

    updateCartProduct = async (req,res,next)=>{
        try {
            const {cid,pid} = req.params
            const {quantity} = req.body
            if(!quantity) {
                CustomError.createError({
                    name: 'No quantity provided',
                    cause: updateQuantityErrorInfo(quantity),
                    message: 'No quantity provided',
                    code: EError.INVALID_TYPE_ERROR
                })
            }
            const cart = await cartsService.getCartById(cid)
            if(!cart.succes) return res.status(404).send(cart)
            const updatedCart = await cartsService.updateCartProduct(cid,pid,quantity)
            res.status(200).send(updatedCart)
        } catch (error) {
            next (error)
        }
    }

    deleteCart = async (req,res,next)=>{
        try {
            const {cid} = req.params
            const deletedCart = await cartsService.deleteCart(cid)
            if(!deletedCart.succes) return res.status(404).send(deletedCart)
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
            console.log('carrito antes de actualizar',cart)
            console.log('productos no vendidos',productsNotPurchased)
            console.log('productos vendidos',productsPurchased)
            const ticket = await ticketsService.createTicket(productsPurchased,user.email)
            const updatedCart = {
                ...cart.payload,
                products: productsNotPurchased.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity
                }))
            };
            await cartsService.updateCart(cart.payload._id, updatedCart)
            console.log('carrito nuevo',updatedCart)
            res.status(200).send({status:'Success',payload:{ticket, updatedCart}})
        } catch (error) {
            next (error)
        }
    }
}



module.exports = new CartsController()

