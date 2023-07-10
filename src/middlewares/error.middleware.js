const { EError } = require('../utils/CustomError/EErrors')

exports.errorHandler = (error, req, res, next) => {
    console.log(error.cause)
    switch (error.code) {
        case EError.INVALID_TYPE_ERROR:
            return send ({status: 'error', error: error.name})
            break
        
        default: 
            return send ({status: 'error', error: 'Unhandled error'})
            break
        
    }
        
}