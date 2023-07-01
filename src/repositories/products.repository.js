

class ProductRepository {
    constructor(dao){
        this.dao = dao    
    }

    getAll = async () => {
        return this.dao.getAll()
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