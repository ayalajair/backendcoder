const {Router} = require('express');
const {UsersManagerMongo} = require('../DAO/db/users.Manager.Mongo')

const router = Router();

const users = new UsersManagerMongo();

//---------POST------------
router.post('/register', async (req, res)=>{
    try {
        const newUser = req.body;
        const result = await users.createUser(newUser); 
        
        if(!result.success){
            return res.status(400).send(result)
        }     
        return res.send(result)
    }catch (error) {
        return res.status()
    }
})

module.exports = router