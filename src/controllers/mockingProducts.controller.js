
const generateProducts = require("../mocks/generateProductsFaker")
const CustomError = require("../utils/CustomError/CustomError")
const { EError } = require("../utils/CustomError/EErrors")
const { getProductsInfo } = require("../utils/CustomError/info")

class MockingProducts {
    constructor() {}
    getMockingProducts = async (req,res) => {
        const products = await generateProducts(100)
        if(!products) {
            CustomError.createError({
                name: 'Find product error',
                cause: getProductsInfo(),
                message: 'Error trying to find Product',
                code: EError.NOT_FOUND,
            })
        }
        return res.json(products)
    }
}

module.exports = new MockingProducts()
