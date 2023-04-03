const express = require('express')
const ProductManager = require ('./ProductManager')

const app = express ()
const PORT = 8080
const products = new ProductManager

app.get('/products', async (req,res)=>{
    try{
        let productList = await products.getProducts()
        res.send(productList)
    } catch(error){
        console.log(error)
    }
})

app.get('/products/:pid', async (req,res)=>{
    try{
        const productId = req.params.pid
        const productList = await products.getProductById(parseInt(productId))
        if(!productId) return res.send ('<h1>error, no se encuentra ese Id</h1>')
        res.send (productList)
        
    } catch(error){
        console.log(error)
    }
})

app.listen (PORT, ()=>{
    console.log('Escuchando al puerto 8080')
})