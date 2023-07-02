

class ProductRepository {
    constructor(dao){
        this.dao = dao    
    }

    getAll = async (limit, page, sort, query) => {
        return this.dao.getAll(limit, page, sort, query)
    }

    getById = async (id) => {
        return this.dao.getById(id)
    }

    create = async (product) => {
        return this.dao.create(product)
    }

    update = async (pid, product) => {
        return this.dao.update(pid, product)
    }

    delete = async (pid) => {
        return this.dao.delete(pid)
    }
}

module.exports = ProductRepository