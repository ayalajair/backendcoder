const {connect} = require('mongoose')
require('dotenv').config()

class MongoSingleton {
    static #intance
    constructor (){
        connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
    }
    static getInstance(){
        if (this.#instance) {
            console.log('Base de datos ya creada') 
            return this.#instance
        }
        this.#instance = new MongoSingleton()
        console.log('Base de datos creada.')
        return this.#instance
    }
}

module.exports = {
    MongoSingleton
}