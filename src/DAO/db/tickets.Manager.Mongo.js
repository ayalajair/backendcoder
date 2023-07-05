const {ticketModel} = require('./models/ticket.model')
const { v4: uuidv4 } = require('uuid')

class TicketsManagerMongo {
    constructor() {}

    async createTicket (products, email) {
    try {
        const code = uuidv4()
        const amount = products.reduce((acc, item) => acc + (item.quantity * item.product.price), 0)
        return await ticketModel.create({
            code: code,
            amount: amount,
            purchaser: email,
            products: products
        }
    )
        
    } catch (error) {
        return new Error(error)
    }
    
    }
}

module.exports = {TicketsManagerMongo}