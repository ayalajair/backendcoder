const {Schema, model} = require('mongoose');

const collection = 'users';

const userSchema = new Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    age: {type: Number, required: true},
    password: {type: String, required: true},
    cart: {type: Schema.Types.ObjectId,required: true,ref: 'carts'},
    role: {type: String, enum: ['admin','premium','user'], default: 'user'}

}
)

const userModel = model(collection, userSchema);

module.exports = {userModel}