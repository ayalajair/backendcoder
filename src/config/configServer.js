const{connect} = require ('mongoose')
module.exports = {
    connectDB: ()=>{
        connect('mongodb://localhost:27017/ecommerce')
        console.log('Database connected')
    }
}