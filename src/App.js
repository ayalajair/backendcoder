const express = require('express')
const handlebars = require ('express-handlebars')
const cookieParser = require('cookie-parser')
const {Server} = require ('socket.io')



const productsRouter = require ('./routes/products.router')
const cartsRouter = require ('./routes/carts.router')
const viewsRouter = require ('./routes/views.router')
const { socketProducts } = require('./utils/socketProducts')

const app = express ()
const PORT = 8080

const httpServer = app.listen (PORT, ()=>{
    console.log('Escuchando al puerto 8080')
})

//Setear motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set ('view engine', 'handlebars')

app.use(express.json())

app.use(express.urlencoded({extended: true}))

//Setear static
app.use('/static', express.static(__dirname + '/public'))
app.use(cookieParser())

//Setear socket.io
const io = new Server (httpServer)
socketProducts(io)


// http://localhost:8080
app.use('/', viewsRouter)

// http://localhost:8080/api/products
app.use('/api/products', productsRouter)

// httP://localhost:8080/api/carts
app.use('/api/carts', cartsRouter)


