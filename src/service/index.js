const {cartsManagerMongo} = require('../DAO/db/carts.Manager.Mongo')
const ProductsManagerMongo = require('../DAO/db/products.Manager.Mongo')	
const { UsersManagerMongo } = require('../DAO/db/users.Manager.Mongo')
const CartRepository = require('../repositories/carts.repository')
const ProductRepository = require('../repositories/products.repository')
const UserRepository = require('../repositories/users.repository')


const cartsService =new CartRepository(new cartsManagerMongo())

const productsService = new ProductRepository(new ProductsManagerMongo())

const usersService = new UserRepository(new UsersManagerMongo())


module.exports = {
    cartsService,
    productsService,
    usersService,
}