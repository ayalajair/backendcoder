const { logger } = require("../logger");


const authorization = role => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({status: 'error', error: 'User not authenticated'})
            }
        if (req.user.role !== role) {
            return res.status(403).send({status: 'error',error: 'User not authorized'});
        }
        logger.info('User authorized')
        next();
    
    }
}

module.exports = {authorization}