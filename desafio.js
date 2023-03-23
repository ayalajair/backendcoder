

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
        }catch (err){
            console.log (Error)
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((p) => p.id === id);
        if (!product) {
            console.log("No se han encontrado productos con ese ID");
            return;
        }
        return product;
    }
}

const productList = new ProductManager(path);


//Test
//Agrego producto 
productList.addProduct({title:'Producto', description: 'Descripción', price: 100, thumbnail: 'thumbnail', code:'123456', stock: 100});
//Agrego producto con el mismo código
//productList.addProduct({title:'Producto', description: 'Descripción', price: 100, thumbnail: 'thumbnail', code:'123456', stock: 100});
//Agrego producto incompleto
//productList.addProduct({title:'Producto2', description: 'Descripción', price: 100, thumbnail: 'thumbnail', code:'123456'});
//Agrego 2do producto
//productList.addProduct({title:'Producto3', description: 'Descripción', price: 100, thumbnail: 'thumbnail', code:'123457', stock: 100});
//Busco producto con Id 2
//console.log(productList.getProductById(2));
//Busco producto con Id 10
//productList.getProductById(10);
//Pido lista completa de productos
//console.log(productList.getProducts());