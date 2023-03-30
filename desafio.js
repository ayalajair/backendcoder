

const fs = require('fs');

const path = './Products.json'
class ProductManager {
    constructor(path) {
        this.path = path
    }
//Carga de productos desde el JSON
    loadProducts = async ()=> {
        try{
            if(fs.existsSync(path)){
            const products = await fs.promises.readFile (path, 'utf-8');
            return JSON.parse (products);}
            await fs.promises.writeFile (path,'[]','utf-8')
            return []
        } catch (err) {
            console.log (Error);
        }        
    }

    addProduct = async (product)=> {
        try {           
        const products = await this.loadProducts()
        const { title, description, price, thumbnail, code, stock } = product;
            //Chequeo que todos los campos hayan sido completados
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log("Se deben completar todos los compos");
                return;
            }
            
            //Cheque que el código de producto no se repita
            if (products.find((p) => p.code === code)) {
                console.log(`Ya se ha ingresado un producto con ese código`);
                return;
            }
            
            const newProduct = {
                id: products.length + 1,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            };
            //Pusheo el nuevo producto en products y lo escribo en el Json
            products.push(newProduct);
            await fs.promises.writeFile (this.path,JSON.stringify(products),'utf8');
        }catch (error){
            console.log (error);
        }
    }

    getProducts = async () => {
        try{
            const products = await this.loadProducts();
            console.log (products)
            return products;
        } catch (error){
            console.log (error)
        }
    }

    getProductById = async (id) => {
        try {
            const products = await this.loadProducts()
            const product = products.find((p) => p.id === id);
            if (!product) {
                console.log("No se han encontrado productos con ese ID");
                return;
            }
            console.log (product)
            return product;
        }
        catch (error) {
            console.log (error)
        }
    }

    updateProduct = async (id, updatedProduct) => {
        try {
            const products = await this.loadProducts();
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                console.log("No se han encontrado productos con ese ID");
                return;
            }
            const product = products.find((p) => p.id === id);
            if (!product) {
                console.log("No se han encontrado productos con ese ID");
                return;
            }
            const updatedProductWhitId = {
                id: id ,
                title: updatedProduct.title, 
                description: updatedProduct.description, 
                price: updatedProduct.price, 
                thumbnail: updatedProduct.thumbnail, 
                code:updatedProduct.code, 
                stock: updatedProduct.stock
            }
            products[productIndex] = updatedProductWhitId;
            console.log (updatedProduct)
            await fs.promises.writeFile (this.path,JSON.stringify(products),'utf8');
        } catch (error) {
            console.log (error)
        }
    }

    deleteProduct = async (id) => {
        try {

            const products = await this.loadProducts();
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                console.log ("No se han encontrados productos con ese ID")
                return null;
            }
            const deletedProduct = products.splice(productIndex, 1)[0];
            await fs.promises.writeFile (this.path,JSON.stringify(products),'utf8');
            console.log ("El producto ha sido borrado con éxito")
            return deletedProduct;
        } catch (error) {
            console.log (error)
        }
        
    }
}

//Test
const test = async ()=> {

    const productList = new ProductManager(path);

    //Muestro los productos
    await productList.getProducts()

    //Agrego producto 
    await productList.addProduct({
        title:'Producto',
        description: 'Descripción', 
        price: 100, 
        thumbnail: 'thumbnail', 
        code:'123456', 
        stock: 100});

    //Vuelvo a mostrar los productos
    await productList.getProducts()

    //Agrego producto con el mismo código
    await productList.addProduct({
        title:'Producto', 
        description: 'Descripción', 
        price: 100, 
        thumbnail: 'thumbnail', 
        code:'123456', 
        stock: 100});

    //Agrego producto incompleto
    await productList.addProduct({
        title:'Producto2',
        description: 'Descripción', 
        price: 100, 
        thumbnail: 'thumbnail', 
        code:'123456'});

    //Agrego 2do producto
    await productList.addProduct({
        title:'Producto3', 
        description: 'Descripción', 
        price: 100, 
        thumbnail: 'thumbnail', 
        code:'123457', 
        stock: 100});

    //Vuelvo a mostrar los productos
    await productList.getProducts()

    //Busco producto con Id 2
    await productList.getProductById(2);

    //Busco producto con Id 10
    await productList.getProductById(10);

    //Modifico un producto
    let newProduct = {
        title:'Producto4', 
        description: 'Descripción2', 
        price: 200, 
        thumbnail: 'thumbnail', 
        code:'123456', 
        stock: 100}

    await productList.updateProduct(2, newProduct )

    //Vuelvo a mostrar los productos
    await productList.getProducts()

    //Borro un producto
    await productList.deleteProduct(1)

    //Vuelvo a mostrar los productos
    await productList.getProducts()
}

test()