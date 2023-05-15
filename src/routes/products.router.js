const { Router } =  require('express')
const ProductManager = require ('../DAO/db/products.Manager.Mongo')
const { query, validationResult } = require('express-validator');

const router = Router();
const products = new ProductManager()


//-----------------GET------------------------------------------
router.get('/',[
    query('limit').optional().isInt({ min: 1 }).toInt(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('availability').optional().isBoolean().toBoolean()
    ],async (req,res)=>{
    try{
        const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
        
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sortPrice = req.query.sortPrice || null;
        let sort = null;
    
        if (sortPrice === "asc") {
            sort = { price: 1 };
        } else if (sortPrice === "desc") {
            sort = { price: -1 };
        }
    
        let query = {};
        if (req.query.category) {
            query = { ...query, category: req.query.category };
        }
        if (req.query.availability) {
            query = { ...query, status: req.query.availability};
        }
        console.log({limit,page,sort,query})
        const productList = await products.getProducts(limit,page,sort,query)
        
        res.status(200).send({productList})
        res.render('products',{productList})
    

    }catch(error){
        res.status(400).send({status:'Router error', error})
    }
})

router.get('/:pid', async (req,res)=>{
    try{
        const {pid} = req.params
        const productList = await products.getProductById(pid)
        if(!productList) return res.status(404).send('Error: no se encuentra ese Id')
        res.status(200).send ({status:'success', payload:productList})
        
    } catch(error){
        res.status(400).send({status:'Router error', error})
    }
})

//---------------------POST----------------------------------------------
router.post('/', async (req, res)=> {
    try{
        const toAddProduct = req.body
        
        const respuesta = await products.addProduct(toAddProduct)
        
        //Si devuelve falso, hay algún problema con el producto
        if(!respuesta.success) {return res.status(400).send(respuesta)}

        //Si devuelve verdadero, se ha creado el nuevo producto
        res.status(200).send(respuesta)

    } catch (error) {
        res.status(400).send({status:'Router error', error})
    }

})
//----------------------PUT--------------------------------------
router.put('/:pid', async (req , res)=>{
    const {pid} = req.params
    const toChangeProduct = req.body

    const updatedProduct = await products.updateProduct(pid, toChangeProduct)

    //Sí devuelve falso, hay algún problema con la actualización
    if(!updatedProduct.success) {
        return res.status(400).send(updatedProduct)
    }
    //Si devuelve verdadero, quiere decir que se hizo la actualización
    res.status(200).send(updatedProduct)

})

//---------------------DELETE-----------------------------------------
router.delete('/:pid', async (req,res)=>{
    const {pid} = req.params
    const deletedProduct = await products.deleteProduct(pid)
    //Sí devuelve falso, hay algún problema con el borrado
    if(!deletedProduct.success){
        return res.status(400).send(deletedProduct)
    }
    //Si devuelve verdadero, quiere decir que se borró el producto
    res.status(200).send(deletedProduct)
})

module.exports = router