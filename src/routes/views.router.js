const {Router} = require('express')
const ProductManagerMongo = require('../DAO/db/products.Manager.Mongo')


const router = Router();
const products = new ProductManagerMongo ()

//GET

//Vista Home
router.get('/', async (req,res)=>{
    let limit = req.query.limit
    let productList = await products.getProducts(limit)
    let data = {
        dataProducts: productList,
        style: 'home.css'
    }
    res.render('home',data)
})

//Vista realTimeProducts
router.get('/realtimeproducts', async (req,res)=>{
    let limit = req.query.limit
    let productList = await products.getProducts(limit)
    res.render ('realTimeProducts',productList)
})

//Vista chat
router.get('/chat', (req,res)=>{
    
    res.render('chat',{})
    })

module.exports = router;