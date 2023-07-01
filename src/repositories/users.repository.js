
class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    addUser = async (user) => {
        return this.dao.addUser(user)
    }

    getUserByEmail = async (email)=>{
        return this.dao.getUserByEmail(email)
    }
}

module.exports = UserRepository