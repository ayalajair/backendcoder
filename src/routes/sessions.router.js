const {Router} = require('express');
const {UsersManagerMongo} = require('../DAO/db/users.Manager.Mongo')

const router = Router();

const users = new UsersManagerMongo();

//---------POST------------
router.post('/register', async (req, res)=>{
    try {
        const newUser = req.body
        const result = await users.addUser(newUser); 
        
        if(!result.success){
            return res.status(400).send(result)
        }     
        return res.send(result)
    }catch (error) {
        return res.status(400).send(error)
    }
})

router.post('/login', async (req, res)=>{
    try {
        const {email, password} = req.body
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
            const user = {
                email: 'adminCoder@coder.com'
                password: 'adminCod3r123'
                role: 'admin'
            }
            return res.send({success: true, payload:  user, message: 'Bienvenido admin'})
        }
        const user = await users.getUserByEmail(email)
        if(!user){
            return res.status(401).send({message: 'Credenciales inválidas'})
        } 
        if(user.password !== password){
            return res.status(401).json({ message: 'Credenciales inválidas' })
        } user.role =  'user'

        req.session.user = user;
        res.status(200).json({ message: 'Inicio de sesión exitoso' });

    } catch (error) {
        return res.status(400).send(error)
    
    }
}
module.exports = router