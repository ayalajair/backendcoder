const { Router } = require('express');
const productsRouter = require('./products.router')
const viewsRouter = require('./views.router')
const cartsRouter = require('./carts.router')
const uploadsRouter = require('./uploads.router')
const sessionsRouter = require('./sessions.router')
const mockingProductsRouter = require('./mockingProducts.router')
const loggerTestRouter = require('./loggerTest.router')

const router = Router();

// http://localhost:8080
router.use('/', viewsRouter)

// http://localhost:8080/api/products
router.use('/api/products', productsRouter)

// httP://localhost:8080/api/carts
router.use('/api/carts', cartsRouter)

// http://localhost:8080/api/sessions
router.use('/api/sessions', sessionsRouter)

// http://localhost:8080/uploads
router.use('/uploads', uploadsRouter)

// http://localhost:8080/mockingproducts
router.use('/mockingproducts', mockingProductsRouter)

// http://localhost:8080/logger-test
router.use('/logger-test', loggerTestRouter )



module.exports = router