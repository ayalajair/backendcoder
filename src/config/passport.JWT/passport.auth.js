const passport = require('passport')

// @fix ES NECESARIO RECIBIR EL OPTIONS COMO SEGUNDO PARAMETRO; PARA DESACTIVAR LA SESSION
const passportAuth = (strategy, options) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, options, (err, user) => {
            if (err) {
                return next(err)
            }

            console.log(user)
            if (!user) {
                return res.status(401).send({
                    status: 'error',
                    // @fix TUVE QUE PONER ESTO ASI PORQUE SINO ME DABA ERROR
                    error: 'info.message ?  info.message : info.toString()',
                })
            }

            req.user = user
            next()
        })(req, res, next)
    }
}

module.exports = {
    passportAuth,
}
