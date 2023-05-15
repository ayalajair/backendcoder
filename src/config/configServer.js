const{connect} = require ('mongoose')
module.exports = {
    connectDB: ()=>{
        connect('mongodb+srv://jairayala:coder123456@cluster0.aa9hemg.mongodb.net/ecommerce?retryWrites=true&w=majority')
        console.log('Database connected')
    }
}