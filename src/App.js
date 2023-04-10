const express = require('express')

const productsRouter = require ('./routes/products.router')
const cartsRouter = require ('./routes/carts.router')

const app = express ()
const PORT = 8080


app.use(express.json())

app.use(express.urlencoded({extended: true}))

// http://localhost:8080/api/products
app.use('/api/products', productsRouter)

// httP://localhost:8080/api/carts
app.use('/api/carts', cartsRouter)


app.listen (PORT, ()=>{
    console.log('Escuchando al puerto 8080')
})