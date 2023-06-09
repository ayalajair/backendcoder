const {cartsService, productsService, ticketsService} = require('../service/index')

class CartsController {

    getCarts = async (req,res)=>{
        try {
            const allCarts = await cartsService.getCarts()
            res.send({status:'Success',payload:allCarts})
        } catch (error) {
            res.status(400).send({status:'Router error',error})
        }
    }

    getCartById = async (req,res)=>{
        try{
            const {cid} = req.params
            const cart = await cartsService.getCartById(cid)
            res.status(200).send(cart)
        }catch(error){
            res.status(400).send({status:'Router error',error})
        }
    }

    addCart = async (req,res)=>{
        try{
            const cart = await cartsService.addCart() 
            res.send({status: 'Success', payload: cart})
        } catch(error){
            res.status(400).send({status:'Router error',error})
        }
    }

    addToCart = async (req,res)=>{
        try{
            const {cid,pid} = req.params 
            const updatedCart = await cartsService.addToCart(cid, pid, 1)
            res.send(updatedCart)
        }catch (error){
            res.status(400).send({status:'Router',error})
        }
    }

    updateCart = async (req,res)=>{
        try {
            const {cid} = req.params
            const cart = req.body
            const updatedCart = await cartsService.updateCart(cid, cart)
            if(!updatedCart.succes) return res.status(404).send(updatedCart)
            res.status(200).send(updatedCart)
        } catch (error) {
            res.status(400).send({status:'Router',error})
        }
    }

    updateCartProduct = async (req,res)=>{
        try {
            const {cid,pid} = req.params
            const {quantity} = req.body
            if(!quantity) return res.status(400).send({status:'Router',error:'No quantity'})
            const cart = await cartsService.getCartById(cid)
            if(!cart.succes) return res.status(404).send(cart)
            const updatedCart = await cartsService.updateCartProduct(cid,pid,quantity)
            if(!updatedCart.succes) return res.status(404).send(updatedCart)
            res.status(200).send(updatedCart)
        } catch (error) {
            res.status(400).send({status:'Router',error})
        }
    }

    deleteCart = async (req,res)=>{
        try {
            const {cid} = req.params
            const deletedCart = await cartsService.deleteCart(cid)
            if(!deletedCart.succes) return res.status(404).send(deletedCart)
            res.status(200).send(deletedCart)
        }
        catch (error) {
            res.status(400).send({status:'Router',error})
        }
    }

    deleteFromCart = async (req,res)=>{
        try {
            const {cid,pid} = req.params
            const deletedProduct = await cartsService.deleteFromCart(cid,pid)
            res.status(200).send(deletedProduct)
        } catch (error) {
            res.status(400).send({status:'Router',error})
        }
    }

    purchase = async (req,res)=>{
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
            res.status(400).send({status:'Router',error})
        }
    }
}



module.exports = new CartsController()

