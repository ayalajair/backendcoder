const { Router } = require('express')
const ProductManagerMongo = require('../DAO/db/products.Manager.Mongo')
const { cartsManagerMongo } = require('../DAO/db/carts.Manager.Mongo')
const { query, validationResult } = require('express-validator');
const { userModel } = require('../DAO/db/models/user.model');
const { passportAuth } = require('../config/passport.JWT/passport.auth');



const router = Router()
const products = new ProductManagerMongo()
const carts = new cartsManagerMongo()




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
    async (req,res)=>{
        // Verificar si el usuario ha iniciado sesión
        let user = req.user
        // Redirigir al usuario a la página de inicio de sesión si no está autenticado
        if (!user) {
            return res.redirect('/')
        }
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res
            .status(400)
            .send({message: 'Error en los parametros de entrada', errors});
        }
        const {
            limit = 10,
            page = 1, 
            priceSort = null, 
            category = null, 
            availability = null
        } = req.query
        
        const filter = {}
        if (category) {
            filter.category = category
        }
        if (availability) {
            filter.availability = availability
        }

        let sort = null

        if (priceSort === 'asc') {
            sort = { price: 1 }
        }
        if (priceSort === 'desc') {
            sort = { price: -1 }
        }

        let productList = await products.getProducts(limit, page, sort, filter)
        
        user = await userModel.findById(req.user._id).lean()

        let data = {
            dataProducts: productList,
            dataUser: user,
            style: 'home.css',
        }

        res.render('products', data)
    })

//Vista Cart
router.get(
    '/carts/:cid',
    passportAuth('jwt', { session: false }),
    async (req, res) => {
    let { cid } = req.params
    let cart = await carts.getCartById(cid)
    let data = {
        dataCart: cart,
    }
    res.render('cart', data)
})

//Vista realTimeProducts
router.get(
    '/realtimeproducts',
    passportAuth('jwt', { session: false }),
    async (req, res) => {
    let limit = req.query.limit
    let productList = await products.getProducts(limit)
    res.render('realTimeProducts',productList)
})

//Vista chat
router.get(
    '/chat',
    passportAuth('jwt', { session: false }),
    (req, res) => {
    res.render('chat',{})
    })
    

//Vista login
router.get(
    '/', 
    async (req, res) => {
    res.render('login',{
        style: 'home.css'
    })
})

//Vista register
router.get(
    '/register',
    async (req, res) => {
    res.render('register',{
        style: 'home.css'
    })
})



module.exports = router;