const {cartsManagerMongo} = require('../DAO/db/carts.Manager.Mongo')
const ProductsManagerMongo = require('../DAO/db/products.Manager.Mongo')	
const {UsersManagerMongo} = require('../DAO/db/users.Manager.Mongo')

const cartsService = new cartsManagerMongo()

const productsService = new ProductsManagerMongo()

const usersService = new UsersManagerMongo()


module.exports = {
    cartsService,
    productsService,
    usersService,
}