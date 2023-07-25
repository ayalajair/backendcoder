const { Router } = require('express')
const { login, register, gitHubCallBack, logout, failLogin, failRegister, toUser, forgotPassword, resetPassword } = require ('../controllers/sessions.controller')
const passport = require('passport')
const { passportAuth } = require('../config/passport.JWT/passport.auth')
const { authorization } = require('../config/passport.JWT/passport.authorization')
const router = Router()





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
    toUser)

//------Logout-------

router.get('/logout',
    logout,
)

//------Failed register-------

router.get(
    '/failRegister', 
    failRegister,
    )


//------Failed login-------
router.get(
    '/failLogin',
    failLogin,
)

//------Login with GitHub-------
router.get(
    '/github',
    passport.authenticate('github', {scope:['user: email']}))


router.get(
    '/githubcallback',
    passport.authenticate('github',{
        failureRedirect:'/failLogin'}), 
    gitHubCallBack,
)

//------Forgot password-------

router.post('forgot-password', forgotPassword)

//------Reset password-------

router.post('reset-password/:token',  resetPassword)


module.exports = router