const { Router } = require('express')

const router = Router()

router.get('/', (req, res) => {
    try {
      // Simulando un error
      throw new Error('Esto es un error importante.');
    } catch (error) {
      // Registro el error usando el logger
      req.logger.error(error.message)
    }
  
    // Otros logs para probar diferentes niveles
    req.logger.debug('Este es un mensaje de nivel debug.')
    req.logger.http('Este es un mensaje de nivel http.')
    req.logger.info('Este es un mensaje de nivel info.')
    req.logger.warning('Este es un mensaje de nivel warning.')
    req.logger.fatal('Este es un mensaje de nivel fatal.')
  

    res.send('Test de logs completado.')
  })

  module.exports = router