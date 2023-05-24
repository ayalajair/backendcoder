const {Router} = require('express');
const {UsersManagerMongo} = require('../DAO/db/users.Manager.Mongo');
const { createHash } = require('../utils/bcryptHash');

const router = Router();

const users = new UsersManagerMongo();

//----------GET------------
router.get('/logout', (req, res) => {
    // Limpiar la sesión
    req.session.destroy();

    // Redirigir al usuario a la página de inicio de sesión u otra página
    return res.redirect('/');
});

//---------POST------------
router.post('/register', async (req, res)=>{
    try {
        const {first_name, last_name, email, password} = req.body

        const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password)
        }
        const result = await users.addUser(newUser); 
        
        if(!result.success){
            return res.status(400).send(result)
        }     
        return res.redirect('/')
        
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
        }

        const user = await users.authenticateUser(email, password);
        
        
        if(!user){
            return res.status(401).send('Usuario o contraseña incorrectos')
        } else {user.role = 'user'}
        req.session.user = user;
        res.redirect('/products')

    } catch (error) {
        return res.status(400).send(error)
    
    }
})

module.exports = router