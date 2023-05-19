const {userModel} = require('./models/user.model')

class UserManagerMongo {


    async createUser(user) {
        try {
            const user = await userModel.create(user)

            return user
        } catch (error) {

            throw new Error(error)
        }
    }
}