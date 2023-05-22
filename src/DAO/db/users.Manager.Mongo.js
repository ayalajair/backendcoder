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
                    success: false
                }
                return respuesta
            } 
            
            //Validamos que el usuario no exista
            const userExist = await userModel.findOne({email: user.email})
            if (userExist) {
                const respuesta = {
                    status: 'error',
                    message: 'El usuario ya existe',
                    success: false
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
                    success: false
                }
                return respuesta
            }
            // const nuevoUsuario = {
            //     first_name: "lucas",
            //     last_name: "garcia",
            //     email: "lugar@gmail.com",
            //     date_of_birth: "1990-10-01",
            //     password: "123456",
            //     role: "user"
            // }
            //Creamos el usuario
            const newUser = new userModel(user)
            console.log(newUser)
            await newUser.save()

            const respuesta = {
                status: 'success',
                message: 'Usuario creado correctamente',
                payload: newUser,
                success: true
            }

            return respuesta

        } catch (error) {

            throw new Error(error)
        }
    }

    
}

module.exports = {UsersManagerMongo}