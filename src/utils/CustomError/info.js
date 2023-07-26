
exports.getProductsErrorInfo = () =>{
    return 'Cannot find any products'
}


exports.findProductErrorInfo = (id) =>{
    return `Cannot find any product with the Id: ${id}`
}

exports.createProductErrorInfo = (product) =>{
    return `One or more properties of the product are missing or invalid. Properties recived: *title: must to be string, recived: ${product.title}, *description: must to be string, recived: ${product.description}, *category: must to be string, recived: ${product.category}, *price: must to be number, recived: ${product.price}, *thumbnail: must to be string, recived: ${product.thumbnail}, *stock: must to be number, recived: ${product.stock}, *code: must to be string, recived: ${product.code},`
}

exports.productExistErrorInfo = (product) =>{
    return `A product with the code: ${product.code} already exist`
}

exports.productUpdateErrorInfo = (id, product) =>{
    return `There is no product with the Id: ${id} or one or more properties of the product to updated are invalid, Properties recived: *title: must to be string, recived: ${product.title}, *description: must to be string, recived: ${product.description}, *category: must to be string, recived: ${product.category}, *price: must to be number, recived: ${product.price}, *thumbnail: must to be string, recived: ${product.thumbnail}, *stock: must to be number, recived: ${product.stock}, *code: must to be string, recived: ${product.code},`
}

exports.productdeleteErrorInfo = (id) =>{
    return `There is no product with the Id: ${id}`
}

exports.productDeleteRoleErrorInfo = () =>{
    return `The product is not yours`
}

exports.findCartsErrorInfo = () =>{
return 'Cannot find any carts'
}

exports.findCartErrorInfo = (id) =>{
    return 'Cannot find any cart with the Id: {$id}'
}

exports.findProductInCartErrorInfo = (id) =>{
    return 'Cannot find any product in cart with the Id: {$id}'
}

exports.updateCartErrorInfo = (id, products) =>{
    return 'One or more properties of the cart are missing or invalid. Properties recived: Id: {$id}, Products: {$products}'
}

exports.updateQuantityErrorInfo = (quantity)=>{
    return `The quantity must to be a number, recived: ${quantity}`

}

exports.createUserErrorInfo = (user) =>{
    return `One or more properties of the user are missing or invalid. Properties recived: *name: must to be string, recived: ${user.first_name}, *lastName: must to be string, recived: ${user.last_name}, *email: must to be string, recived: ${user.email},*age: must to be number, recived: ${user.age}, *password: must to be string, recived: ${user.password}`
}

exports.credentialsErrorInfo = () =>{
    return `The email or password are already in use.`
}

exports.findUserErrorInfo = (email) =>{
    return `Cannot find any user with the email: ${email}`
}

