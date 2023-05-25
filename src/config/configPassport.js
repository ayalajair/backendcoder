const passport = require ('passport');
const local = require ('passport-local')
const {userModel} = require('../DAO/db/models/user.model')
const {createHash, isValidPassword} = require('../utils/bcryptHash')

const localStrategy = local.Strategy

const initPassport = () => {
    // Configuramos el registro de  passport
    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const {first_name, last_name} = req.body
        try {
            const user = await userModel.findOne({email: username})

            //Si existe el usuario se informa que ya existe
            if (user) return done(null, false, {message: 'El usuario ya existe'})
            //Si no existe el usuario se crea
            const newUser = {
                first_name,
                last_name,
                email: username,
                password: createHash(password)
            }
            const userCreated = await userModel.create(newUser)
            return done(null, userCreated)
        } catch (error) {
            return done('Error al obtener usuario'+error)
        
        }
    }))
}

module.exports = {initPassport}