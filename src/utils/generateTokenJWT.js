const jwt =  require('jsonwebtoken');
const{privateKey} = require('../config/configServer')

const generateToken = (data) => {
    return jwt.sign(data, privateKey, {expiresIn: '1d'})

}

const generateResetToken = (data) => {
    return jwt.sign(data, privateKey, {expiresIn: '1h'})

}

module.exports = {
    generateToken,
    generateResetToken
}