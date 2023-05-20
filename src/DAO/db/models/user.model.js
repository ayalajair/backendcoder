const {Schema, model} = require('mongoose');

const collection = 'users';

const UserSchema = new Schema({
    fist_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date_of_birth: {type: Date, required: true},
    role: {type: String, required: false},
})

const userModel = model(collection, UserSchema);

module.exports = {userModel}