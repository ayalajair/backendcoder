const { productsService } = require("../service");
const { CustomError } = require("../utils/CustomError/CustomError");
const { EError } = require("../utils/CustomError/EErrors");
const { productDeleteRoleErrorInfo } = require("../utils/CustomError/info");



const checkProductOwnerOrAdmin =  async (req, res, next)=>{
    try {
        const { pid } = req.params
        const product = await productsService.getById(pid)
        
        // Verificar si el usuario es admin
        if (req.user.role === 'admin') {
            return next();
        }

        // Verificar si el usuario es premium y es el propietario del producto
        if (req.user.role === 'premium' && product.owner.equals(req.user._id)) {
            return next();
        }

        CustomError.createError({
            name: 'Not Athorized',
            cause: productDeleteRoleErrorInfo(),
            message: 'Error trying to delete a product',
            code: EError.UNAUTHORIZED,
        })

    }catch (error) {
        throw error
    }
}

module.exports = {
    checkProductOwnerOrAdmin
}