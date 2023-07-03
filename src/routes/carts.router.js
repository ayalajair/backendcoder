const { Router } = require('express');
const {cartsManagerMongo} = require ('../DAO/db/carts.Manager.Mongo');
const { getCarts, getCartById, addCart, addToCart, updateCart, updateCartProduct, deleteCart, deleteFromCart, purchase } = require('../controllers/carts.controller');


const router = Router();
const carts = new cartsManagerMongo()

//--------------------GET-----------------------------
router.get('/', getCarts)

router.get('/:cid', getCartById)

//--------------------POST----------------------------

router.post('/', addCart)

router.post('/:cid/product/:pid', addToCart)

router.post('/:cid/purchase', purchase)

//----------------PUT-------------------------------

router.put('/:cid', updateCart)

router.put('/:cid/product/:pid', updateCartProduct)

//----------------DELETE-------------------------------

router.delete('/:cid', deleteCart)

router.delete('/:cid/product/:pid', deleteFromCart)

module.exports = router