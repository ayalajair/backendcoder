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

//------Succesfull login-------

router.post('/login', passport.authenticate('login', {failureRedirect: '/failLogin',  successRedirect: '/products'
}), async (req, res)=>{
    if(!req.user){
        return res.status(401).send('Usuario o contraseña incorrectos')
    }
    req.session.user = req.user
    res.send({status: 'success',  message: 'Login exitoso'})
})

//------Failed login-------
router.get('/failLogin', (req, res) => {
    console.log('Login fallido')
    res.send({status: 'error', error: 'Login fallido'})
})

module.exports = router