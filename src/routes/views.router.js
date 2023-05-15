const {Router} = require('express')
const ProductManagerMongo = require('../DAO/db/products.Manager.Mongo')



const router = Router();
const products = new ProductManagerMongo ()

//GET
//Vista Products
router.get('/products', async (req,res)=>{
        const {limit = 10, page = 1, priceSort = null, category = null, availability = null} = req.query
        let query = {}
        if(category){
            query = {...query, category}
        }
        if(availability){
            query = {...query, availability}
        }

        let sort = priceSort ? { price: priceSort === 'asc' ? 1 : -1 } : null;

        let productList = await products.getProducts(limit, page, query, sort)
        let data = {
            dataProducts: productList,

            style: 'home.css'
        }
        console.log(data)
        res.render('products',data)
    })
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