const { Router } = require('express')
const { query } = require('express-validator');
const { passportAuth } = require('../config/passport.JWT/passport.auth');
const { showProducts, showCart, showRealTime, showChat, showLogin, showRegister } = require('../controllers/views.controller');



const router = Router()




//GET
//Vista Products
router.get(
    '/products',
    [
    query('limit')
        .optional()
        .isInt()
        .toInt()
        .isInt({ min: 1 })
        .isInt({ max: 100 }),
    query('page')
        .optional()
        .isInt()
        .toInt()
        .isInt({ min: 1 })
        .isInt({ max: 100 }),
    query('priceSort')
        .optional()
        .isIn(['asc', 'desc']),
    query('category').optional(),
    query('availability').optional()
    ],
    passportAuth('jwt', {session: false}),
    showProducts)

//Vista Cart
router.get(
    '/carts/:cid',
    passportAuth('jwt', { session: false }),
    showCart)

//Vista realTimeProducts
router.get(
    '/realtimeproducts',
    passportAuth('jwt', { session: false }),
    showRealTime)

//Vista chat
router.get(
    '/chat',
    passportAuth('jwt', { session: false }),
    showChat)
    

//Vista login
router.get(
    '/', 
    showLogin)

//Vista register
router.get(
    '/register',
    showRegister)



module.exports = router;