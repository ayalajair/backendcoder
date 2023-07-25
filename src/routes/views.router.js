const { Router } = require('express')
const { query } = require('express-validator');
const { passportAuth } = require('../config/passport.JWT/passport.auth')
const { showProducts, showCart, showRealTime, showChat, showLogin, showRegister, showForgotPassword } = require('../controllers/views.controller');
const { authorization } = require('../config/passport.JWT/passport.authorization');



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
    authorization('user'),
    showChat)
    

//Vista login
router.get(
    '/', 
    showLogin)

//Vista register
router.get(
    '/register',
    showRegister)

//Vista forgotPassword
router.get(
    '/forgotPassword',
    showForgotPassword)

//Vista resetPassword
router.get(
    '/resetPassword',
    showLogin)

//Vista changePassword
router.get(
    '/changePassword',
    showLogin)

//Vista profile
router.get(
    '/profile',
    passportAuth('jwt', { session: false }))

module.exports = router;