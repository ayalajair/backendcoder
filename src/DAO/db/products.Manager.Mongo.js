const EventEmitter = require('events');
const {productModel} = require('./models/product.model')

class ProductManagerMongo {
    constructor() {
        this.events = new EventEmitter
        this.events.setMaxListeners(50)
    }

//-------------GET PRODUCTS----------------
    async getAll(limit, page, sort, query) {
        try {
            console.log('limit',limit)
            console.log('page',page)
            console.log('sort',sort)
            console.log('query',query)
            //Creamos la query para la paginación
            const products = await productModel.paginate(
                query, {limit, page, sort, lean:true}
                )
            
            console.log('products', products)
            //Validamos haya productos
            if(products.totalDocs === 0) {
                return {
                    status: 'error',
                    message: 'No se encontraron productos',
                    success: false
                }
            }
            const {docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage, totalDocs} = products

            //Creamos las urls para la paginación
            const prevLink = hasPrevPage ? `http://localhost:8080/products?limit=${limit}&page=${prevPage}` : null
            const nextLink = hasNextPage ? `http://localhost:8080/products?limit=${limit}&page=${nextPage}` : null
            
            if(sort===1){
                prevLink += `&priceSort=asc`
                nextLink += `&priceSort=asc`
            }
            if(sort===-1){
                prevLink += `&priceSort=desc`
                nextLink += `&priceSort=desc`
            }

            if(query.category){
                prevLink += `&category=${query.category}`
                nextLink += `&category=${query.category}`
            } if(query.status){
                prevLink += `&available=${query.status}`
                nextLink += `&available=${query.status}`
            }
            //Creamos el objeto de respuesta
            const respuesta = {
                status: 'success',
                payload: docs,
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink,
                totalDocs: totalDocs,
                success: true
            }

            return respuesta

        } catch (error) {
            return new Error(error)
        }
    }
//--------------GET PRODUCT BY ID-------------
    async getById(id){
        try {
            return await productModel.findById(id)
        } catch (error) {
            return new Error(error)
        }
    }

//-------------ADD PRODUCT----------------
    async create(product){
        try {
            //Validamos que cada el objeto tenga todas las propiedades
            if (!product.hasOwnProperty('title') ||
            !product.hasOwnProperty('description') ||
            !product.hasOwnProperty('code') ||
            !product.hasOwnProperty('price') ||
            !product.hasOwnProperty('stock') ||
            !product.hasOwnProperty('category')) {
            const respuesta = {
                status: 'error',
                message: 'El producto no tiene todas las propiedades requeridas',
                success: false};
            return respuesta
            }
            // Validamos el tipo de cada propiedad
            if (typeof product.title !== 'string' ||
            typeof product.description !== 'string' ||
            typeof product.code !== 'string' ||
            typeof product.price !== 'number' ||
            typeof product.stock !== 'number' ||
            typeof product.category !== 'string'
            //||!Array.isArray(product.thumbnails)
            ) {
            const respuesta = {
            status: 'error',
            message: 'El producto tiene una o más propiedades con un tipo incorrecto',
            succes:false}
            return respuesta
            }
            //Validamos que el producto no exista
            if (await productModel.exists({code: product.code})) {
            const respuesta = {
                status: 'error',
                message: 'Ya se ha ingresado un producto con ese código',
                success: false};
            return respuesta
            }
            this.events.emit('addProduct', product).setMaxListeners()
            return await productModel.create(product)
        } catch (error) {
            return new Error(error)
        }
    }
//-------------UPDATE PRODUCT-------------
    async  update(id, product){
        try {
            return await productModel.findOneAndUpdate({_id: id}, product)
        }catch (error) {
            return new Error(error)
        }
    }

//-------------DELETE PRODUCT-------------
    async delete(id){
        try {
            deletedProduct = await productModel.findOneAndDelete({_id: id})
            this.events.emit('deleteProduct', id).setMaxListeners()
            return deletedProduct
        }catch (error) {
            return new Error(error)
        }
    }

}

module.exports = ProductManagerMongo