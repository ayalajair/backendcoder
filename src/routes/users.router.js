const { Router } = require('express')
const { toggleUserRole } = require('../controllers/users.controller')

const router = Router()

router.put('/premium/:uid', toggleUserRole)

module.exports = router