

class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTicket = async (products, email) => {
        return await this.dao.createTicket(products, email)
    }

}

module.exports = TicketRepository