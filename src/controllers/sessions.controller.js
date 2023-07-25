const UserDTO = require('../DTO/user.dto');
const { logger } = require('../config/logger');
const { usersService } = require("../service");
const { generateToken, generateResetToken } = require('../utils/generateTokenJWT')
require('dotenv').config()


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
        logger.info('Login exitoso')
        res.redirect('/products')
    }

    logout = async (req, res) => {
        // Eliminar la cookie que contiene el token
        res.clearCookie('cookieToken', { expires: new Date(0)} ).redirect('/')
    }

    failLogin = async (req, res) => {
        logger.error('Login fallido')
        res.send({ status: 'error', error: 'Login fallido' })
    }

    failRegister = async (req, res) => {
        logger.error('Registro fallido')
        res.send({status: 'error', error: 'Registro fallido'})
    }

    toUser = async (req, res) => {
        let user = await usersService.findUserByEmail(req.user.email)
        const userDTO = new UserDTO(user)
        let toUser = userDTO.toUser()
        res.send(toUser)
    }

    forgotPassword = async (req, res) => {
        try {
            console.log(req.body)
            const { email } = req.body
            
            const user = await usersService.findUserByEmail(email)
            // Generar el token de restablecimiento de contraseña
            const token = generateResetToken(user.email)
            // Enviar el correo con el enlace de restablecimiento de contraseña
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                port: 587,
                auth: {
                  user: process.env.GMAIL_USER,
                  pass: process.env.GMAIL_PASS
                },
            })
            const mailOptions = {
                from: process.env.GMAIL_USER, 
                to: email,
                subject: 'Recuperación de contraseña',
                html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                       <a href="http://localhost:8080/api/sessions/reset-password/${token}">Restablecer contraseña</a>`,
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  logger.error(error)
                  return res.status(500).send({ message: 'Error al enviar el correo de recuperación' })
                }
                logger.info('Correo de recuperación enviado')
                res.send({ message: 'Correo de recuperación enviado' })
              })

        } catch (error) {
            throw error
        }
        
    }

    resetPassword = async (req, res) => {
        try {
            const { token } = req.params
            const { password } = req.body
            decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            //Buscamos el usuario por email en la base de datos
            const user = await usersService.findUserByEmail(decodedToken)
            // Verificar que la nueva contraseña no sea igual a la contraseña anterior
            const isSamePassword = await bcrypt.compare(password, user.password);
            if (isSamePassword) {
                return res.status(400).json({ message: 'No puedes utilizar la misma contraseña anterior' });
            }

            // Hashear la nueva contraseña
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;

            // Guardar el usuario actualizado en la base de datos
            await user.save();

        res.status(200).send({ message: 'Contraseña restablecida con éxito' })
            
        }catch (error) {
            throw error
        }
    }

}





module.exports = new SessionController()