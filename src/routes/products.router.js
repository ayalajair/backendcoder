const { Router} =  require('express')
const ProductManager = require ('../DAO/db/products.Manager.Mongo')

const { query } = require('express-validator');
const { getProducts, getProductsById, addProduct, updateProduct, deleteProduct } = require('../controllers/products.controller');




const router = Router();
const products = new ProductManager()

//-----------------GET------------------------------------------
router.get('/',[
    query('limit').optional().isInt().toInt().isInt({ min: 1 }).isInt({ max: 100 }),
    query('page').optional().isInt().toInt().isInt({ min: 1 }).isInt({ max: 100 }),
    query('priceSort').optional().isIn(['asc', 'desc']),
    query('category').optional(),
    query('availability').optional()
    ], getProducts)


router.get('/:pid', getProductsById)

//---------------------POST----------------------------------------------
router.post('/', addProduct)
//----------------------PUT--------------------------------------
router.put('/:pid', updateProduct)

//---------------------DELETE-----------------------------------------
router.delete('/:pid', deleteProduct)

module.exports = router