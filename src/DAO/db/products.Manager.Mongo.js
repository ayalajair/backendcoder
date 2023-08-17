const EventEmitter = require('events')
const {productModel} = require('./models/product.model')
const { CustomError } = require('../../utils/CustomError/CustomError')
const { getProductsInfo, createProductErrorInfo, findProductErrorInfo, productExistErrorInfo, productUpdateErrorInfo } = require('../../utils/CustomError/info');
const { EError } = require('../../utils/CustomError/EErrors')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


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
                CustomError.createError({
                    name: 'No Products Found',
                    cause: getProductsInfo(),
                    message: 'There is no products',
                    code: EError.NOT_FOUND
                })
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
            throw error
        }
    }
//--------------GET PRODUCT BY ID-------------
    async getById(id){
        try {
            const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null
            const product = await productModel.findById(objectId)
            if(!product){
                CustomError.createError({
                    name: 'Product Not Found',
                    cause: findProductErrorInfo(id),
                    message: 'There is no product with this id',
                    code: EError.NOT_FOUND
                })
            }
            return product
        } catch (error) {
            throw error
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
                CustomError.createError({
                    name: 'Product creation error',
                    cause: createProductErrorInfo(product),
                    message: 'There is an issue with the properties',
                    code: EError.INVALID_TYPE_ERROR,
                })
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
                CustomError.createError({
                    name: 'Product creation error',
                    cause: createProductErrorInfo(product),
                    message: 'There is an issue with the type of the properties',
                    code: EError.INVALID_TYPE_ERROR,
                })
            }
            //Validamos que el producto no exista
            if (await productModel.exists({code: product.code})) {
                CustomError.createError({
                    name: 'Product creation error',
                    cause: productExistErrorInfo(product),
                    message: 'There is a product with this code',
                    code: EError.CONFLICT,
                })
            }
            this.events.emit('addProduct', product)
            return await productModel.create(product)
        } catch (error) {
            throw error
        }
    }
//-------------UPDATE PRODUCT-------------
    async  update(id, product){
        try {
            const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null
            const productUpdated = await productModel.findOneAndUpdate({_id: objectId}, product)
            console.log('productUpdated', productUpdated)
            if(!productUpdated){
                CustomError.createError({
                    name: 'Update product error',
                    cause: productUpdateErrorInfo(id, product),
                    message: 'Cant update product',
                    code: EError.NOT_FOUND
                })
            }
            return productUpdated
        }catch (error) {
            throw error
        }
    }

//-------------DELETE PRODUCT-------------
    async delete(id){
        try {
            const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null
            const deletedProduct = await productModel.findOneAndDelete({_id: objectId})
            if(!deletedProduct){
                CustomError.createError({
                    name: 'Delete product error',
                    cause: findProductErrorInfo(id),
                    message: 'Cant delete product',
                    code: EError.NOT_FOUND
                })
            }
            this.events.emit('deletedProduct', id).setMaxListeners()
            return deletedProduct
        }catch (error) {
            console.error(error.name)
            console.error(error.message)
            console.error(error.code)
            console.error(error.cause)
            throw error
        }
    }

}

module.exports = ProductManagerMongo