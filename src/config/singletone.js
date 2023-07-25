const mongoose = require('mongoose')
const { logger } = require('./logger')
require('dotenv').config()

class MongoSingleton {
    static #instance 
    constructor(){
        mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }
    static getInstance(){
        if (this.#instance) {
           logger.info('Database already created') 
           return this.#instance
        }
        this.#instance = new MongoSingleton()
        logger.info('Database created')
        return this.#instance
        
    }


}

module.exports = {
    MongoSingleton
}
