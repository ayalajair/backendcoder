const { Router } =  require('express')
const ProductManager = require ('../managerDAOS/ProductManager')

const router = Router();
const products = new ProductManager ('./src/Products.json')


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
        const {pid} = req.params
        const productList = await products.getProductById(parseInt(pid))
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
        
        const respuesta = await products.addProduct(toAddProduct)
        
        //Si devuelve falso, hay algún problema con el producto
        if(!respuesta.succes) return res.status(400).send(respuesta)

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
    if(!updatedProduct.succes) {
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