const{connect} = require ('mongoose')
const { logger } = require('./logger')
require('dotenv').config()

module.exports = {
    privateKey: process.env.JWT_SECRET_KEY,
    connectDB: ()=>{
        connect(process.env.MONGO_URL)
        logger.info('Database connected')
    }
}