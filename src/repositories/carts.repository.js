class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    addCart = async (cart) => {
        return await this.dao.addCart(cart)
    }

    getCarts = async () => {
        return await this.dao.getCarts()
    }

    getCartById = async (id) => {
        return await this.dao.getCartById(id)
    }

    addToCart = async (cartId, productId, quantity) => {
        return await this.dao.addToCart(cartId, productId, quantity)
    }

    deleteCart = async (id) => {
        return await this.dao.deleteCart(id)
    }

    deleteFromCart = async (cartId, productId) => {
        return await this.dao.deleteFromCart(cartId, productId)
    }

    updateCart = async (id, cart) => {
        return await this.dao.updateCart(id, cart)
    }

    updateCartProduct = async (cartId, productId, quantity) => {
        return await this.dao.updateCartProduct(cartId, productId, quantity)
    }

}

module.exports = CartRepository