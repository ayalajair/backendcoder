const bcrypt = require('bcrypt');

//Funcion para crear el hash de la contraseña

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

//Funcion para comparar el hash con la contraseña

const isValidPassword = (password,  userpass) => bcrypt.compareSync(password, userpass)


module.exports = {
    createHash,
    isValidPassword }