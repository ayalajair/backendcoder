const socket = io()
const chatBox = document.getElementById('chatBox')
const messageLogs = document.getElementById('messageLogs')


Swal.fire({
    title: 'Identificate',
    input: 'text',
    text: 'Ingresa tu nombre de usario.',
    inputValidator: (value) => {
        return !value && 'Debes ingresar tu nombre de usuario'
    },
    allowOutsideClick: false,
}).then(result => {
    user = result.value
})

chatBox.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        if (chatBox.value.trim().length > 0)
            socket.emit('message', {
                user,
                message: chatBox.value
            })
            chatBox.value = ''
    }

})

socket.on('messageLogs',data => {
    console.log(data)
    let messages = ''
    data.forEach(message => {
        messages += `<li>${message.user} dice: ${message.message}</li>`
    })
    messageLogs.innerHTML = messages
})