const{connect} = require ('mongoose')
module.exports = {
    connectDB: ()=>{
        //connect('mongodb://localhost:27017/ecommerce')
        connect('mongodb+srv://jairayala:coder123456@cluster0.aa9hemg.mongodb.net/ecommerce')
        console.log('Database connected')
    }
}