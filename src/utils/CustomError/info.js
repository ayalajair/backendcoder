
exports.getProductsInfo = () =>{
    return 'Cannot find any products'
}


exports.findProductErrorInfo = (id) =>{
    return 'Cannot find any product with the Id: {$id}'
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

