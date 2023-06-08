const {Router} = require('express');
const {login, register} = require ('../controllers/sessions.controller')
const {UsersManagerMongo} = require('../DAO/db/users.Manager.Mongo');
const passport = require('passport');
const {generateToken} = require('../utils/generateTokenJWT')

const router = Router();



//------Logout-------
router.get('/logout', (req, res) => {
    // Limpiar la sesión
    req.session.destroy();

    // Redirigir al usuario a la página de inicio de sesión u otra página
    return res.redirect('/');
});

//------Succesfull register-------
router.post('/register', register)

//------Succesfull login-------

router.post('/login', login)

//------Failed register-------

router.get('/failRegister', (req, res) => {
    console.log('Registro fallido')
    res.send({status: 'error', error: 'Registro fallido'})
})


//------Failed login-------
router.get('/failLogin', (req, res) => {
    console.log('Login fallido')
    res.send({status: 'error', error: 'Login fallido'})
})

//------Login with GitHub-------
router.get('/github', passport.authenticate('github', {scope:['user: email']}))


router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/failLogin'}), async (req, res)=>{
    console.log(req.user)
    const token = generateToken(req.user)
    console.log('Login exitoso')
    res.cookie('cookieToken',token,{"maxAge": 3600000, httpOnly: true}).send({status: 'success', token})
    // res.redirect('/products')
})


module.exports = router