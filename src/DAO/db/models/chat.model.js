const {Schema, model} = require('mongoose');

const collection = 'chats'

const chatsSchema = new Schema({
    chats: [{
        message: String, 
        user: String
    }]
})

const chatsModel = model(collection, chatsSchema);

module.exports = chatsModel;