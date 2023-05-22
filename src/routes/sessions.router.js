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
        return res.redirect('/login')
        
    }catch (error) {
        return res.status(400).send(error)
    }
})

router.post('/login', async (req, res)=>{
    try {
        const {email, password} = req.body
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
            const user = {
                first_name:'admin',
                last_name: 'admin',
                email: 'adminCoder@coder.com',
                password: 'adminCod3r123',
                role: 'admin'
            }
            req.session.user = user
            return res.redirect('/products')
            // return res.status(200).send({payload:  user, message: 'Bienvenido admin'})
        }

        const user = await users.authenticateUser(email, password);
        if(!user){
            return res.status(400).send({message: 'Credenciales incorrectas'})
        }

        req.session.user = user;
        // res.status(200).json({ message: 'Inicio de sesión exitoso' })
        res.redirect('/products')

    } catch (error) {
        return res.status(400).send(error)
    
    }
})

module.exports = router