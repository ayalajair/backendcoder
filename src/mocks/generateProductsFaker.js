const {faker} = require('faker');

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
            stock: faker.random.numeric(),
            code: faker.random.numeric(),
            status: faker.random.boolean()
        }
        products.push(product)
    }
    return products
}

module.exports = generateProducts