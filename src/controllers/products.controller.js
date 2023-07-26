const { validationResult } = require('express-validator');
const { productsService } = require('../service/index');
const CustomError = require('../utils/CustomError/CustomError');
const { getProductsErrorInfo, findProductErrorInfo, createProductErrorInfo, productUpdateErrorInfo, productdeleteErrorInfo } = require('../utils/CustomError/info');
const { EError } = require('../utils/CustomError/EErrors');
const { logger } = require('../config/logger');




class ProductController {
    
    
    getAll = async (req,res,next)=>{
        try{
            const errors = validationResult(req);
            //Si hay errores, devuelve un error 400 con los errores
            if (!errors.isEmpty()) {
                CustomError.createError({
                    name: 'Input parameters Error',
                    cause: getProductsErrorInfo(),
                    message: 'There is an error in the input parameters',
                    code: EError.INVALID_TYPE_ERROR
                })
            }
            
            //Si no hay errores, se ejecuta la consulta
            const {limit = 10, page = 1, priceSort = null, category = null, availability = null} = req.query
            //Se crea un objeto con los filtros
            const filter = {}
            if(category) {
                filter.category = category
            }
            
            if(availability) {
                filter.status = availability
            }
            //Se crea un objeto con los ordenamientos
            let sort = null
            
            if(priceSort==='asc'){
                sort = {price: 1}
            }
            if(priceSort==='desc'){
                sort = {price: -1}
            }

            
            const productList = await productsService.getAll(limit, page, sort, filter)
            console.log('list',productList)
            
            //Si devuelve falso, hay algún problema con la consulta
            if(!productList) {
                CustomError.createError({
                    name: 'Products not found',
                    cause: getProductsErrorInfo(),
                    message: 'There is no products found',
                    code: EError.NOT_FOUND
                })
            }
            //Si devuelve verdadero, Se envía el producto encontrado como respuesta al cliente
            res.status(200).send(productList)  
    
        } catch(error){
            next(error)
        }
    }

    getById = async (req,res,next)=>{
        try{
            const {pid} = req.params
            const productList = await productsService.getById(pid)
            //Si devuelve falso, hay algón problema con el Id
            if(!productList) {
                CustomError.createError({
                    name: 'Product not found',
                    cause: findProductErrorInfo(pid),
                    message: 'There is no product found with this id',
                    code: EError.NOT_FOUND
                })
            }
            //Si devuelve verdadero, se ha encontrado el producto
            logger.info('Product found')
            res.status(200).send ({status:'success', payload:productList})
            
        } catch(error){
            next(error)
        }
    }

    create = async (req, res, next)=> {
        try{
            const toAddProduct = req.body
            const user = req.user
            if(user.role === 'premium') {
                toAddProduct.owner = user._id
            }
            const respuesta = await productsService.create(toAddProduct)
            
            //Si devuelve falso, hay algún problema con el producto
            if(!respuesta.success) {
                CustomError.createError({
                    name: 'Product not created',
                    cause: createProductErrorInfo(toAddProduct),
                    message: 'There is an error creating the product',
                    code: EError.INVALID_TYPE_ERROR
                })
            }
    
            
            const productadded = await productsService.create(toAddProduct)   
            //Si devuelve verdadero, se ha creado el nuevo producto
            logger.info('Product created')
            res.status(200).send(productadded)
    
        } catch (error) {
            next(error)
        }
    
    }

    update = async (req , res, next)=>{
        try {           
            const {pid} = req.params
            const toChangeProduct = req.body
        
            const updatedProduct = await productsService.update(pid, toChangeProduct)
            //Si devuelve verdadero, quiere decir que se hizo la actualización
            logger.info('Product updated')
            res.status(200).send(updatedProduct)
        } catch (error) {
            next(error)
        }
    
    }

    deleteProduct = async (req,res,next)=>{
        try {
            const {pid} = req.params
            const deletedProduct = await productsService.delete(pid)
            //Si devuelve verdadero, quiere decir que se borró el producto
            logger.info('Product deleted')
            res.status(200).send(deletedProduct) 
        } catch (error) {
            next (error)
        }
    }

}

module.exports = new ProductController()