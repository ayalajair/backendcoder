const { CustomError } = require('../../utils/CustomError/CustomError')
const { EError } = require('../../utils/CustomError/EErrors')
const { createUserErrorInfo, credentialsErrorInfo, findUserErrorInfo, findUserIdErrorInfo } = require('../../utils/CustomError/info')
const {userModel} = require('./models/user.model')

class UsersManagerMongo {
    constructor() {}

    async addUser(user) {
        try {
            
            //Validamos que el usuario tenga todas sus propiedades
            if (!user.email || !user.password || !user.first_name || !user.last_name || !user.age) {
                CustomError.createError({
                    name: 'Create User Error',
                    cause: createUserErrorInfo(user),
                    message: 'check your user object',
                    code: EError.INVALID_TYPE_ERROR
                })
            } 
            
            
            //Si email es igual adminCoder@coder.com y contraseña es igual a adminCod3r123
            //El usuario es administrador
            if (user.email === 'adminCoder@coder.com') {                
                    CustomError.createError({
                        name: 'Credentials Error',
                        cause: credentialsErrorInfo(),
                        message: 'Check your credentials',
                        code: EError.UNAUTHORIZED
                    })
                }

            
            //Creamos el usuario
            const newUser = new userModel(user)
            console.log(newUser)
            await newUser.save()

            return newUser
        } catch (error) {

            throw error
        }
    }

    async getUserByEmail (email) {
        try {
            const user = await userModel.findOne({email: email}).lean()
            if (!user) {
                CustomError.createError({
                    name: 'User not found',
                    cause: findUserErrorInfo(email),
                    message: 'There is no user with that email',
                    code: EError.NOT_FOUND
                })
            }
            return user
        }
        catch (error) {
            throw error
        }
    }

    async getUserById (id) {
        try {
            const userId = ObjectId.isValid(id) ? new ObjectId(id) : null
            const user = await userModel.findOne({_id: ObjectId}).lean()
            if (!user) {
                CustomError.createError({
                    name: 'User not found',
                    cause: findUserIdErrorInfo(id),
                    message: 'There is no user with that id',
                    code: EError.NOT_FOUND
                })
            }
            return user
        } catch (error) {
            throw error
        }
    }

    async updateUser (email, user) {
        try {
            const updatedUser = await userModel.findOneAndUpdate({email: email}, user, {new: true})
            if (!updatedUser) {
                CustomError.createError({
                    name: 'User not found',
                    cause: findUserErrorInfo(email),
                    message: 'There is no user with that email',
                    code: EError.NOT_FOUND
                })
            }
            return updatedUser
        }catch (error) {
            throw error
        }
    }

    
}

module.exports = {UsersManagerMongo}