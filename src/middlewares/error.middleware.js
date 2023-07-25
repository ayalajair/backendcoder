const { EError } = require('../utils/CustomError/EErrors')

const errorHandler = (error, req, res, next) => {
    
    switch (error.code) {
        case EError.ROUTING_ERROR:
            return res.status(400).send ({status: '400', error: error.name, cause: error.cause, message: error.message})
            break
        case EError.NOT_FOUND:
            return res.status(404).send ({status: '404', error: error.name, cause: error.cause, message: error.message})
            break
        case EError.DATABASE_ERROR:
            return res.status(500).send ({status: '500', error: error.name, cause: error.cause, message: error.message})
            break
        case EError.INVALID_TYPE_ERROR:
            return res.status(400).send ({status: '400', error: error.name, cause: error.cause, message: error.message})
            break
        case EError.UNAUTHORIZED:
            return res.status(401).send ({status: '401', error: error.name, cause: error.cause, message: error.message})
            break
        case EError.VALIDATION_ERROR:
            return res.status(400).send ({status: '400', error: error.name, cause: error.cause, message: error.message})
            break
        default: 
            return res.status(500).send ({status: '500', error: 'Unhandled error'})
            break
        
    }       
}

module.exports = {
    errorHandler
}