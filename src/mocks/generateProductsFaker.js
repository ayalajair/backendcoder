const {faker} = require('@faker-js/faker')

const generateProducts= (count)=>{
    const products = []
    for (let i = 0; i < count; i++) {
        const product = {
            id: faker.database.mongodbObjectId(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            category: faker.commerce.department(),
            price: faker.commerce.price(),
            image: faker.image.url(),
            stock: faker.datatype.number(),
            code: faker.datatype.number(),
            status: faker.datatype.boolean()
        }
        products.push(product)
    }
    return products
}

module.exports = generateProducts