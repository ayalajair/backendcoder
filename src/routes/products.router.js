const { Router} =  require('express')
const { query } = require('express-validator');
const { getAll, getById, create, update, deleteProduct  } = require('../controllers/products.controller');
const { authorization } = require('../config/passport.JWT/passport.authorization')



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
    authorization('admin'),
    create
    )
//----------------------PUT--------------------------------------
router.put('/:pid',
    authorization('admin'),
    update,
    )

//---------------------DELETE-----------------------------------------
router.delete('/:pid', 
    authorization('admin'),
    deleteProduct,
    
    )

module.exports = router