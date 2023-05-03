const ProductManager = require("../DAO/file/ProductManager")

const productList = new ProductManager()
const socketProducts = (io) => {
    io.on('connection', async socket => {
        console.log('cliente conectado')
        products = await productList.getProducts()
        io.emit('products', products)

        //Escuchar eventos de addProduct y deleteProduct
        productList.events.on('addProduct', async (newProduct)=>{
            const updatedProducts = await productList.getProducts()
            io.emit('products', updatedProducts)
        })
        productList.events.on('deleteProduct', async (productId)=>{
            const updatedProducts = await productList.getProducts()
            io.emit('products', updatedProducts)
        })
    })
}

module.exports = {
    socketProducts
}