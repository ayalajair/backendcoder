const ProductManager = require("../managerDAOS/ProductManager")

const productList = new ProductManager()
const socketProducts = async (io) => {
    products = await productList.getProducts()
    io.on('connection', socket => {
        console.log('cliente conectado')
        io.emit('products', products)
    })
}

module.exports = {
    socketProducts
}