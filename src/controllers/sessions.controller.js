const { generateToken } = require('../utils/generateTokenJWT')
const { UsersManagerMongo } = require('../DAO/db/users.Manager.Mongo')
const { cartsManagerMongo }  = require('../DAO/db/carts.Manager.Mongo')


const carts = new cartsManagerMongo()
const users = new UsersManagerMongo()

class  SessionController {
    constructor() {}


    login = async (req, res) =>{   
            if (req.user){
                const token = generateToken(user)
                res.cookie('cookieToken',token,{
                    "maxAge": 3600000,
                    httpOnly: true
                }).send({status: 'success', token})
                return
            }
            res.status(401).send({message: 'Usuario no autorizado'})
        }
        
    register = async (req, res) => {
            if (req.user) {
            res.status(201).send(req.user)
            }
        }

    }

module.exports = new SessionController()