const { Router } = require('express');
const CartManager = require ('../managerDAOS/CartManager')
const router = Router();
const carts = new CartManager ('./src/Carts.json')

//--------------------GET-----------------------------
router.get('/:cid', async (req,res)=>{
    try{
        const {cid} = req.params
        const cart = await carts.getCartById(cid)
        if(!cart.success) {
            return res.status(404).send(cart)}
        res.status(200).send(cart)
    }catch(error){
        res.status(400).send({status:'Router error',error})
    }
})

//--------------------POST----------------------------

router.post('/',async (req,res)=>{
    try{
        const cart = req.body
        const respuesta = await carts.newCart(cart)
        if(!respuesta.succes) return res.status(400).send(respuesta) 
        res.status(200).send(respuesta)
    } catch(error){
        res.status(400).send({status:'Router error',error})
    }
})

router.post('/:cid/product/:pid',async (req,res)=>{
    try{
        const {cid,pid} = req.params 
        const cart = await carts.getCartById(cid)
        
    }catch (error){
        res.status(400).send({status:'Router',error})
    }
})

module.exports = router