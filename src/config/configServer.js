const{connect} = require ('mongoose')
module.exports = {
    connectDB: ()=>{
        connect('mongodb+srv://jairayala:coder123456@cluster0.aa9hemg.mongodb.net/')
        console.log('Database connected')
    }
}