const {cartsManagerMongo} = require('../DAO/db/carts.Manager.Mongo')
const ProductsManagerMongo = require('../DAO/db/products.Manager.Mongo')	
const { UsersManagerMongo } = require('../DAO/db/users.Manager.Mongo')
const ProductRepository = require('../repositories/products.repository')
const UserRepository = require('../repositories/users.repository')


const cartsService = new cartsManagerMongo()

const productsService = new ProductRepository(new ProductsManagerMongo())

const usersService = new UserRepository(new UsersManagerMongo())


module.exports = {
    cartsService,
    productsService,
    usersService,
}