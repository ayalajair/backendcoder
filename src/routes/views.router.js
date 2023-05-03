const {Router} = require('express')
const ProductManager = require('../DAO/file/ProductManager')


const router = Router();
const products = new ProductManager ('./src/Products.json')

//GET

//Vista Home
router.get('/', async (req,res)=>{

    let productList = await products.getProducts()
    let data = {
        dataProducts: productList,
        style: 'home.css'
    }
    res.render('home',data)
})

//Vista realTimeProducts
router.get('/realtimeproducts', async (req,res)=>{
    res.render ('realTimeProducts',products)
})

module.exports = router;