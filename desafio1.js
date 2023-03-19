

class ProductManager {
    constructor(products = []) {
        this.products = products;
        this.lastId = 0;
    }

    addProduct(product) {
        const { title, description, price, thumbnail, code, stock } = product;

//Chequeo que todos los campos hayan sido completados
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Se deben completar todos los compos");
            return;
        }

//Cheque que el código de producto no se repita
        if (this.products.find((p) => p.code === code)) {
            console.log(`Ya se ha ingresado un producto con ese código`);
            return;
        }

        const newProduct = {
            id: ++this.lastId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        this.products.push(newProduct);
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

const productList = new ProductManager();


//Test
productList.addProduct({title:'Producto', description: 'Descripción', price: '100', thumbnail: 'thumbnail', code:'123456', stock: '100'});
productList.addProduct({title:'Producto', description: 'Descripción', price: '100', thumbnail: 'thumbnail', code:'123456', stock: '100'});
productList.addProduct({title:'Producto2', description: 'Descripción', price: '100', thumbnail: 'thumbnail', code:'123456'});
productList.addProduct({title:'Producto3', description: 'Descripción', price: '100', thumbnail: 'thumbnail', code:'123457', stock: '100'});
console.log(productList.getProductById(2));
productList.getProductById(10);
console.log(productList.getProducts());