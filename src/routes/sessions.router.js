const {Router} = require('express');
const {UsersManagerMongo} = require('../DAO/db/users.Manager.Mongo');
const { createHash } = require('../utils/bcryptHash');
const passport = require('passport');

const router = Router();

const users = new UsersManagerMongo();

//----------GET------------
router.get('/logout', (req, res) => {
    // Limpiar la sesión
    req.session.destroy();

    // Redirigir al usuario a la página de inicio de sesión u otra página
    return res.redirect('/');
});


router.get('/failRegister', (req, res) => {
    console.log('Registro fallido')
    res.send({status: 'error', error: 'Registro fallido'})
})
//---------POST------------
// router.post('/register', async (req, res)=>{
//     try {
//         const {first_name, last_name, email, password} = req.body

//         const newUser = {
//             first_name,
//             last_name,
//             email,
//             password: createHash(password)
//         }
//         const result = await users.addUser(newUser); 
        
//         if(!result.success){
//             return res.status(400).send(result)
//         }     
//         return res.redirect('/')
        
//     }catch (error) {
//         return res.status(400).send(error)
//     }
// })

//------Succesfull register-------
router.post('/register', passport.authenticate('register', {failureRedirect: '/failRegister',  successRedirect: '/products'
}), async (req, res)=>{
    res.send({status: 'success',  message: 'Registro exitoso'})
})

//------Failed register-------

router.get('/failRegister', (req, res) => {
    console.log('Registro fallido')
    res.send({status: 'error', error: 'Registro fallido'})
})

// router.post('/login', async (req, res)=>{
//     try {
//         const {email, password} = req.body
//         if (email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
//             const user = {
//                 first_name:'admin',
//                 last_name: 'admin',
//                 email: 'adminCoder@coder.com',
//                 password: 'adminCod3r123',
//                 role: 'admin'
//             }
//             req.session.user = user
//             return res.redirect('/products')
//         }

//         const user = await users.authenticateUser(email, password);
        
        
//         if(!user){
//             return res.status(401).send('Usuario o contraseña incorrectos')
//         } else {user.role = 'user'}
//         req.session.user = user;
//         res.redirect('/products')

//     } catch (error) {
//         return res.status(400).send(error)
    
//     }
// })

//------Succesfull login-------

router.post('/login', passport.authenticate('login', {failureRedirect: '/failLogin',  successRedirect: '/products'
}), async (req, res)=>{
    if(!req.user){
        return res.status(401).send('Usuario o contraseña incorrectos')
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
    }

    res.send({status: 'success',  message: 'Login exitoso'})
})

//------Failed login-------
router.get('/failLogin', (req, res) => {
    console.log('Login fallido')
    res.send({status: 'error', error: 'Login fallido'})
})

module.exports = router