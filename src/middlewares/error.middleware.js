const { EError } = require('../utils/CustomError/EErrors')

exports.errorHandler = (error, req, res, next) => {
    console.log(error.cause)
    switch (error.code) {
        case EError.ROUTING_ERROR:
            return res.status(400).send ({status: 'error', error: error.name})
            break
        case EError.NOT_FOUND:
            return res.status(404).send ({status: 'error', error: error.name})
            break
        case EError.DATABASE_ERROR:
            return res.status(500).send ({status: 'error', error: error.name})
            break
        case EError.INVALID_TYPE_ERROR:
            return res.status(400).send ({status: 'error', error: error.name})
            break
        case EError.UNAUTHORIZED:
            return res.status(401).send ({status: 'error', error: error.name})
            break
        case EError.VALIDATION_ERROR:
            return res.status(400).send ({status: 'error', error: error.name})
            break
        default: 
            return res.status(500).send ({status: 'error', error: 'Unhandled error'})
            break
        
    }       
}