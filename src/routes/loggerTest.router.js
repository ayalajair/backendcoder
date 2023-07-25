const { Router } = require('express')

const router = Router()

router.get('/', (req, res) => {
    // Otros logs para probar diferentes niveles
    req.logger.debug('Este es un mensaje de nivel debug.')
    req.logger.http('Este es un mensaje de nivel http.')
    req.logger.info('Este es un mensaje de nivel info.')
    req.logger.warning('Este es un mensaje de nivel warning.')
    req.logger.error('Este es un mensaje de nivel error.')
    req.logger.fatal('Este es un mensaje de nivel fatal.')

    res.send('Test de logs completado.')
  })

  module.exports = router
  