const fs = require('fs');

class CartManager {
    constructor(path) {
        this.path = path
    }

    loadCarts = async () => {
        try{
            if(fs.existsSync(this.path)){
            const carts = await fs.promises.readFile (this.path, 'utf-8')
            return JSON.parse (carts)}
            await fs.promises.writeFile (this.path, '[]','utf-8')
            return []
        } catch(error){
            console.log(error)
        }
    }

    newCart = async(cart) => {
        try{
            if(!Array.isArray(cart)){
                const respuesta = {
                    status:'error',
                    message:'El carrito enviado',
                    succes: false
                }
            }
            const carts = await this.loadCarts()
            const newCart = {
                id: carts.length === 0 ? 1 : carts[carts.length-1].id+1,
                products: cart
            }
            carts.push(newCart)
            await fs.promises.writeFile (this.path,JSON.stringify(carts))
            const respuesta ={
                status:'succes',
                message: 'Se ha creado un nuevo carrito',
                succes: true,
                payload: newCart
            }
            return respuesta
        } catch (error){
            console.log(error)
        }
    }

    getCartById = async(id) => {
        try{
            const carts = await this.loadCarts()
            const cart = carts.find((c)=> c.id === Number(id))
            if(!cart){
                const respuesta = {
                    status:'not found',
                    message:'No se ha encontrado un carrito con ese ID',
                    success: false
                }
                return respuesta
            }
            const respuesta = {
                status: 'succes',
                message: 'Carrito encontrado',
                success: true,
                payload: cart
            }
            return respuesta
        } catch (error) {
            console.log (error)
        }
    }

}

module.exports = CartManager;