const { MongoSingleton } = require('./singletone')
require('dotenv').config()

module.exports = {
    privateKey: process.env.JWT_SECRET_KEY,
    connectDB: async ()=> await MongoSingleton.getInstance()
}