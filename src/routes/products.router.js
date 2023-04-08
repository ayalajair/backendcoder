const { Router } =  require('express')
const ProductManager = require ('../managerDAOS/ProductManager')

const router = Router();
const products = new ProductManager


//-----------------GET------------------------------------------
router.get('/', async (req,res)=>{
    try{
        const productList = await products.getProducts()
        const limit = req.query.limit

        if(!limit|| isNaN(limit)){
            return res.status(200).send({status:'success', payload:productList})
        }
        const limitedProductList = productList.slice(0, limit);
        res.status(200).send({status:'success',payload:limitedProductList});

        
    } catch(error){
        res.status(400).send({status:'Router error', error})
    }
})

router.get('/:pid', async (req,res)=>{
    try{
        const productId = req.params.pid
        const productList = await products.getProductById(parseInt(productId))
        if(!productList) return res.status(404).send('Error: no se encuentra ese Id')
        res.status(200).send ({status:'success',payload:productList})
        
    } catch(error){
        res.status(400).send({status:'Router error', error})
    }
})

//---------------------POST----------------------------------------------
router.post('/', async (req, res)=> {
    try{
        const toAddProduct = req.body

        //Validamos que cada el objeto tenga todas las propiedades
        if (!toAddProduct.hasOwnProperty('title') ||
            !toAddProduct.hasOwnProperty('description') ||
            !toAddProduct.hasOwnProperty('code') ||
            !toAddProduct.hasOwnProperty('price') ||
            !toAddProduct.hasOwnProperty('stock') ||
            !toAddProduct.hasOwnProperty('category')) {
            return res.status(400).send('El producto no tiene todas las propiedades requeridas');
        }
        // Validamos el tipo de cada propiedad
        if (typeof toAddProduct.title !== 'string' ||
            typeof toAddProduct.description !== 'string' ||
            typeof toAddProduct.code !== 'string' ||
            typeof toAddProduct.price !== 'number' ||
            typeof toAddProduct.stock !== 'number' ||
            typeof toAddProduct.category !== 'string'||
            !Array.isArray(producto.thumbnails)) {
            return res.status(422).send('El producto tiene una o más propiedades con un tipo incorrecto');
        }

        const success = await products.addProduct(toAddProduct)
        
        //Si devuelve falso, el producto ya existe en la BD
        if(success) return res.status(409).send({status:'conflict',message:'Ya existe un producto con ese codigo'})

        res.status(200).send({status:'success', message: 'Se ha creado un nuevo producto'})

    } catch (error) {
        res.status(400).send({status:'Router error', error})
    }

})

module.exports = router