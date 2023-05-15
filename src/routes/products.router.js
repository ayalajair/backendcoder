const { Router, query } =  require('express')
const ProductManager = require ('../DAO/db/products.Manager.Mongo')



const router = Router();
const products = new ProductManager()

//-----------------GET------------------------------------------
router.get('/', async (req,res)=>{
    try{
        const {limit = 10, page = 1, priceSort = null, category = null, availability = null} = req.query

        filter = {}
        if(category) {
            filter.category = category
        }
        if(availability) {
            filter.availability = availability
        }
        let sort = priceSort ? { price: priceSort === 'asc' ? 1 : -1 } : null;

        const productList = await products.getProducts(limit, page, sort, filter)
        if(!productList) return res.status(404).send('No se encuentran productos en la base de datos')
        res.status(200).send (productList)  

    } catch(error){
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