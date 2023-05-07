const {Schema, model} = require('mongoose');

const collection = 'messages'

const messagesSchema = new Schema({
    messages: [{
        message: String, 
        user: String
    }]
})

const messagesModel = model(collection, messagesSchema);

module.exports = messagesModel;