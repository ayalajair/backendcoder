const {messageModel} = require('../DAO/db/models/message.model');

// const getMessages = async () => {
//     try { 
//         return await messageModel.find()
//     } catch (error) {
//         throw new Error (error)
//     }
// }
let chat = []
const socketChat = (io) => {
    
    io.on('connection', (socket) => {
        console.log('Usuario Conectado');
        // getMessages().then((messages)=>{
        //     chat = messages
        //     io.emit('messageLogs', chat)
        // })
        socket.on('message', async (data)=>{
            console.log(data)
            chat.push(data)
            io.emit('messageLogs', chat)
        })
        socket.on('disconnect', () => {
            console.log('Usuario Desconectado');
        });
    });
    return io;

}

module.exports = {socketChat}