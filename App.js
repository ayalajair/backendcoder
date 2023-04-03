const express = require('express')
const ProductManager = require ('./ProductManager')

const app = express ()
const PORT = 8080
const products = new ProductManager

app.use(express.urlencoded({extended: true}))

app.get('/products', async (req,res)=>{
    try{
        const productList = await products.getProducts()
        const limit = req.query.limit

        if(!limit|| isNaN(limit)){
            return res.send(productList)
        }
        const limitedProductList = productList.slice(0, limit);
        res.send(limitedProductList);

        
    } catch(error){
        console.log(error)
    }
})

app.get('/products/:pid', async (req,res)=>{
    try{
        const productId = req.params.pid
        const productList = await products.getProductById(parseInt(productId))
        if(!productId) return res.send('Error: no se encuentra ese Id')
        res.send (productList)
        
    } catch(error){
        console.log(error)
    }
})

app.listen (PORT, ()=>{
    console.log('Escuchando al puerto 8080')
})