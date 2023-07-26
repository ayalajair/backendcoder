const { logger } = require("../logger");


const authorization = roles => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({status: 'error', error: 'User not authenticated'})
            }
        const userRole = req.user.role;
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).send({ status: 'error', error: 'User not authorized' });
        }
        
        logger.info('User authorized')
        next();
    
    }
}

module.exports = {authorization}