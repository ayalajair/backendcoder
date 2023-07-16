const { EError } = require('../utils/CustomError/EErrors')

exports.errorHandler = (error, req, res, next) => {
    console.log(error.cause)
    switch (error.code) {
        case EError.ROUTING_ERROR:
            return send ({status: 'error', error: error.name})
            break
        case EError.NOT_FOUND:
            return send ({status: 'error', error: error.name})
            break
        case EError.DATABASE_ERROR:
            return send ({status: 'error', error: error.name})
            break
        case EError.INVALID_TYPE_ERROR:
            return send ({status: 'error', error: error.name})
            break
        case EError.UNAUTHORIZED:
            return send ({status: 'error', error: error.name})
            break
        case EError.VALIDATION_ERROR:
            return send ({status: 'error', error: error.name})
            break
        default: 
            return send ({status: 'error', error: 'Unhandled error'})
            break
        
    }       
}