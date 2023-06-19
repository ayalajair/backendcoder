const passport = require('passport');
const local = require('passport-local')
require('dotenv').config()
const GitHubStrategy = require('passport-github2')
const { Strategy, ExtractJwt } = require('passport-jwt')
const { userModel } = require('../DAO/db/models/user.model')
const { createHash, isValidPassword } = require('../utils/bcryptHash')
const { privateKey } = require('../config/configServer')
const { cartsManagerMongo } = require('../DAO/db/carts.Manager.Mongo')

const localStrategy = local.Strategy

//Inicializamos passport-Jwt
const JWTStrategy = Strategy
const ExtractJWT = ExtractJwt
let cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['cookieToken']
    }
    return token
}

const initPassportJwt = () => {
    passport.use(
        'jwt',
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
                secretOrKey: privateKey,
            }, 
            async (jwt_payload, done) => {
                try {
                    done(null, jwt_payload)
                } catch (error) {
                    return done(error)    
                }
    }))
}


//Configuramos el login de passport y Github
const carts = new cartsManagerMongo()

const initPassportGithub = () => {

    passport.use(
        'login',
        new localStrategy(
            {
                usernameField: 'email',
            },
            async (username, password, done) => {
                try{
                    if(username === process.env.ADMIN_EMAIL || password === process.env.ADMIN_PASS) {
                        let user = {first_name: 'Admin',
                                    last_name: 'Coder',
                                    email: 'adminCoder@coder.com',
                                    age: '99',
                                    password: 'adminCod3r123',
                                    role:'admin'}
                        return done(null, user)
                    }
                    let user = await userModel
                        .findOne({email: username})
                        .lean()
                    if (!user) return done(null, false,
                        {message: 'Usuario no encontrado',
                        })

                    
                    if (!isValidPassword(password, username)) 
                    return done(null, false, {
                        message: 'Contraseña incorrecta',
                    })
                    return done(null, user)
                }
                catch(error){
                    return done(error)
                }
            }
        )
    )

    passport.use (
        'register',
        new localStrategy(
            {
                passReqToCallback: true,
                usernameField: 'email',
            },
        async (req, username, password, done) => {
            const { first_name, last_name, age } = req.body
            try {
                const user = await userModel.findOne({email: username})

                //Si el usuario se informa que ya existe
                if (user) {
                    return done(null, false, {
                        message: 'El usuario ya existe',
                    })
                }
                //Si el usuario no existe, se crea
                const newUser = {
                    first_name,
                    last_name,
                    email: username,
                    age: age,
                    cart: await carts.addCart(),
                    password: await createHash(password),
                }
                const userCreated = await userModel.create(newUser)
                return done(null, userCreated)
            
                } catch (error) {
                    return done ('Error la obtener el usuario ' + error)
                }
            }
        )
    )

    passport.use(
        'github', 
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret:  process.env.GITHUB_CLIENT_SECRET,
                callBackURL: process.env.GITHUB_CALLBACK_URL    
            }, 
            async (accessToken, refreshToken, profile, done) => {
        
        try {
            let user = await userModel
                .findOne({email: profile._json.email})
                .lean()
            console.log(profile)
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    email: profile._json.email,
                    password:profile._json.node_id,
                    age:0,
                    cart: await carts.addCart(),
                }
                console.log('newUser',newUser)
                let result = await userModel.create(newUser)
                return done(null, result)
            }
            return done (null, user)
        } catch (error) {
            return done('Error al obtener el usuario'+error)
        }
            }
        )
    )
}


//------Se configura las sesiones de passport-------//
passport.serializeUser((user, done) => {
    done(null, user._id)

})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }

})



module.exports = {
    initPassportGithub,
    initPassportJwt,
}