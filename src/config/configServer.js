const{connect} = require ('mongoose')
require('dotenv').config()

module.exports = {
    privateKey: process.env.JWT_SECRET_KEY,
    connectDB: ()=>{
        connect(process.env.MONGO_URL)
        console.log('Database connected')
    }
}