const {userModel} = require('./models/user.model')

class UsersManagerMongo {
    constructor() {}

    async createUser(user) {
        try {
            //Validamos que el usuario tenga todas sus propiedades
            if (!user.email || !user.password || !user.first_name || !user.last_name || !user.date_of_birth) {
                const respuesta = {
                    status: 'error',
                    message: 'Faltan datos',
                    success: 'false'
                }
                return respuesta
            } 

            //Chequeamos que la fecha de nacimiento sea valida
            const date = new Date(user.date_of_birth)
            if (isNaN(date.getTime())||date.getFullYear() > new Date().getFullYear() || date.getFullYear() < 1900) {
                const respuesta = {
                    status: 'error',
                    message: 'La fecha de nacimiento es invalida',
                    success: 'false'
                }
                return respuesta
            
            }

            //Validamos que el usuario no exista
            const userExist = await userModel.findOne({email: user.email})
            if (userExist) {
                const respuesta = {
                    status: 'error',
                    message: 'El usuario ya existe',
                    success: 'false'
                }
                return respuesta
            }
            //Si email es igual adminCoder@coder.com y contraseña es igual a adminCod3r123
            //El usuario es administrador
            if (user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123') {
                user.role = 'admin'
            } else {
                user.role = 'user'
            }

            //Validamos que la contraseña sea correcta para el admin
            if (user.email === 'adminCoder@coder.com' && user.password !== 'adminCod3r123') {
                const respuesta = {
                    status: 'error',
                    message: 'La contraseña es incorrecta',
                    success: 'false'
                }
                return respuesta
            }
            //Creamos el usuario
            const newUser = await userModel.create(user)

            const respuesta = {
                status: 'success',
                message: 'Usuario creado correctamente',
                payload: newUser,
                success: 'true'
            }

            return respuesta

        } catch (error) {

            throw new Error(error)
        }
    }

    
}

module.exports = {UsersManagerMongo}