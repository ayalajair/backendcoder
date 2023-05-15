const { Router } = require('express');
const {cartsManagerMongo} = require ('../DAO/db/carts.Manager.Mongo')

const router = Router();
const carts = new cartsManagerMongo()

//--------------------GET-----------------------------
router.get('/', async (req,res)=>{
    try {
        const allCarts = await carts.getCarts()
        res.send({status:'Success',payload:allCarts})
    } catch (error) {
        res.status(400).send({status:'Router error',error})
    }
})

router.get('/:cid', async (req,res)=>{
    try{
        const {cid} = req.params
        const cart = await carts.getCartById(cid)
        res.status(200).send(cart)
    }catch(error){
        res.status(400).send({status:'Router error',error})
    }
})

//--------------------POST----------------------------

router.post('/',async (req,res)=>{
    try{
        const cart = await carts.addCart() 
        res.send({status: 'Success', payload: cart})
    } catch(error){
        res.status(400).send({status:'Router error',error})
    }
})

router.post('/:cid/product/:pid',async (req,res)=>{
    try{
        const {cid,pid} = req.params 
        const updatedCart = await carts.addToCart(cid, pid, 1)
        res.send(updatedCart)
    }catch (error){
        res.status(400).send({status:'Router',error})
    }
})

//----------------PUT-------------------------------

//----------------DELETE-------------------------------

router.delete('/:cid',async (req,res)=>{
    try {
        const {cid} = req.params
        const deletedCart = await carts.deleteCart(cid)
        if(!deletedCart.succes) return res.status(404).send(deletedCart)
        res.status(200).send(deletedCart)
    }
     catch (error) {
        res.status(400).send({status:'Router',error})
    }
})

router.delete('/:cid/product/:pid',async (req,res)=>{
    try {
        const {cid,pid} = req.params
        const deletedProduct = await carts.deleteProduct(cid,pid)
        res.status(200).send(deletedProduct)
    } catch (error) {
        res.status(400).send({status:'Router',error})
    }

})

module.exports = router