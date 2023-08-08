const { Router } = require('express');
const { getCarts, getCartById, addCart, addToCart, updateCart, updateCartProduct, deleteCart, deleteFromCart, purchase } = require('../controllers/carts.controller');
const { passportAuth } = require('../config/passport.JWT/passport.auth');

const router = Router();


//--------------------GET-----------------------------
router.get('/',
    passportAuth('jwt', {session: false}),
    getCarts)

router.get('/:cid',
    passportAuth('jwt', {session: false}),
    getCartById)

//--------------------POST----------------------------

router.post('/',
    passportAuth('jwt', {session: false}),
    addCart)

router.post('/:cid/product/:pid',
    passportAuth('jwt', {session: false}),
    addToCart)

router.post('/:cid/purchase',
    passportAuth('jwt', {session: false}),
    purchase)

//----------------PUT-------------------------------

router.put('/:cid',
    passportAuth('jwt', {session: false}),
    updateCart)

router.put('/:cid/product/:pid',
    passportAuth('jwt', {session: false}),
    updateCartProduct)

//----------------DELETE-------------------------------

router.delete('/:cid', 
    passportAuth('jwt', {session: false}),
    deleteCart)

router.delete('/:cid/product/:pid', 
    passportAuth('jwt', {session: false}),
    deleteFromCart)

module.exports = router