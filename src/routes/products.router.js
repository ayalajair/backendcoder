const { Router} =  require('express')
const { query } = require('express-validator');
const { getAll, getById, create, update, deleteProduct  } = require('../controllers/products.controller');
const { authorization } = require('../config/passport.JWT/passport.authorization');
const { passportAuth } = require('../config/passport.JWT/passport.auth');
const { checkProductOwnerOrAdmin } = require('../middlewares/checkProductOwnerOrAdmin.middleware.js')



const router = Router();


//-----------------GET------------------------------------------
router.get('/',[
    query('limit').optional().isInt().toInt().isInt({ min: 1 }).isInt({ max: 100 }),
    query('page').optional().isInt().toInt().isInt({ min: 1 }).isInt({ max: 100 }),
    query('priceSort').optional().isIn(['asc', 'desc']),
    query('category').optional(),
    query('availability').optional()
    ], getAll)


router.get('/:pid', getById)

//---------------------POST----------------------------------------------
router.post('/', 
    passportAuth('jwt', {session: false}),
    authorization(['admin','premium']),
    create
    )
//----------------------PUT--------------------------------------
router.put('/:pid',
    passportAuth('jwt', {session: false}),
    authorization('admin'),
    checkProductOwnerOrAdmin,
    update,
    )

//---------------------DELETE-----------------------------------------
router.delete('/:pid',
    passportAuth('jwt', {session: false}), 
    authorization('admin'),
    checkProductOwnerOrAdmin,
    deleteProduct,
    
    )

module.exports = router