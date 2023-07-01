const UserDTO = require('../DTO/user.dto')
const { usersService } = require("../service");
const { generateToken } = require('../utils/generateTokenJWT')


class  SessionController {
    constructor() {}

    login = async (req, res) =>{   
            if (req.user){
                const token = generateToken(req.user)
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
    
    gitHubCallBack = async (req, res)=>{
        if (req.user) {
            console.log('req.user', req.user)
            const token = generateToken(req.user)
            res.cookie('cookieToken', token, { 
                maxAge: 3600000,
                httpOnly: true,
        })
    }
        console.log('Login exitoso')
        res.redirect('/products')
    }

    logout = async (req, res) => {
        // Eliminar la cookie que contiene el token
        res.clearCookie('cookieToken', { expires: new Date(0)} ).redirect('/')
    }

    failLogin = async (req, res) => {
        console.log('Login fallido')
        res.send({ status: 'error', error: 'Login fallido' })
    }

    failRegister = async (req, res) => {
        console.log('Registro fallido')
        res.send({status: 'error', error: 'Registro fallido'})
    }

    toUser = async (req, res) => {
        let user = await usersService.findUserByEmail(req.user.email)
        const userDTO = new UserDTO(user)
        console.log('userDTO', userDTO)
        let toUser = userDTO.toUser()
        res.send(toUser)
    }

    }





module.exports = new SessionController()