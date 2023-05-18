//Importaciones
const express = require('express')
const handlebars = require ('express-handlebars')
const cookieParser = require('cookie-parser')
const {Server} = require ('socket.io')
const logger = require('morgan')
const {connectDB} = require('./config/configServer')
const {create} = require('connect-mongo') 

const productsRouter = require ('./routes/products.router')
const viewsRouter = require ('./routes/views.router')
const cartsRouter = require ('./routes/carts.router')
const uploadsRouter = require ('./routes/uploads.router')
const { socketProducts } = require('./utils/socketProducts')
const { socketChat } = require('./utils/socketChat')


//Inicializaciones
const app = express ()
const PORT = 8080

connectDB()

//Configuraciones
const httpServer = app.listen (PORT, ()=>{
    console.log('Listening on port 8080')
})

//Setear motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set ('view engine', 'handlebars')

//Setear body parser
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Setear static
app.use('/static', express.static(__dirname + '/public'))
app.use(cookieParser('P@l@braS3cr3t0'))

//Setear session
app.use(session({
    store: create ({
        mongoUrl: 'mongodb://localhost:27017/ecommerce',
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 1000000*6000
    }),
    secret: 'SecretWord',
    resave: false,
    saveUninitialized: false,
}))

//Setear socket.io
const io = new Server (httpServer)
socketProducts(io)
socketChat(io)


// http://localhost:8080
app.use('/', viewsRouter)

// http://localhost:8080/api/products
app.use('/api/products', productsRouter)

// httP://localhost:8080/api/carts
app.use('/api/carts', cartsRouter)

// http://localhost:8080/uploads
app.use('/uploads', uploadsRouter)

app.use(logger('dev'))


