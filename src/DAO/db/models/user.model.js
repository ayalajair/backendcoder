const {Schema, model} = require('mongoose');

const collection = 'users';

const UserSchema = new Schema({
    username: {type: String, required: true},
    fist_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
})

const userModel = model(collection, UserSchema);

module.exports = {userModel}