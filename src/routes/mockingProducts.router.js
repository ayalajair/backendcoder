const {Router} = require('express')
const { getMockingProducts } = require('../controllers/mockingProducts.controller')

const router = Router()

router.get('/', getMockingProducts)

module.exports = router