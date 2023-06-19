const { Router } = require('express');
const { login, register } = require ('../controllers/sessions.controller')
const { UsersManagerMongo } = require('../DAO/db/users.Manager.Mongo');
const passport = require('passport');
const { generateToken } = require('../utils/generateTokenJWT')
const { passportAuth } = require('../config/passport.JWT/passport.auth')
const { authorization,
} = require('../config/passport.JWT/passport.authorization')

const router = Router();




//------Succesfull register-------
router.post(
    '/register',
    passportAuth( 'register', { session: false }),
    register
)
//------Succesfull login-------

router.post('/login',
    passportAuth('login', { session: false }),
    login
)

//------Current-----------------

router.get(
    '/current',
    passportAuth('jwt'),
    authorization('user'),
    (req, res) => {
    user = req.user
    res.send(user)
})

//------Logout-------

router.post('/logout', (req, res) => {
    // Eliminar la cookie que contiene el token
    res.clearCookie('cookieToken').redirect('/')
})

//------Failed register-------

router.get(
    '/failRegister', 
    (req, res) => {
    console.log('Registro fallido')
    res.send({status: 'error', error: 'Registro fallido'})
})


//------Failed login-------
router.get(
    '/failLogin',
    (req, res) => {
    console.log('Login fallido')
    res.send({ status: 'error', error: 'Login fallido' })
})

//------Login with GitHub-------
router.get(
    '/github',
    passport.authenticate('github', {scope:['user: email']}))


router.get(
    '/githubcallback',
    passport.authenticate('github',{
        failureRedirect:'/failLogin'}), 
    async (req, res)=>{
        if (req.user) {
            console.log('req.user', req.user)
            const token = generateToken(req.user)
            res.cookie('cookieToken', token, { 
                maxAge: 3600000,
                httpOnly: true,
        })
    }
    console.log('Login exitoso')
    res.redirect('/products')
})



module.exports = router