
const { usersService } = require("../service")

class UsersController {
    constructor() 
    
    toggleUserRole = async (req, res, next) => {
        try {
            const { uid } = req.params
            const user = await usersService.getUserById(uid)
            user.role = user.role === 'user' ? 'premium' : 'user'
            const updatedUser = await usersService.updateUser(user.email, user)
            res.status(200).send(updatedUser)
        
        } catch (error) {
            next(error)
        }

    }

}

module.exports = new UsersController()