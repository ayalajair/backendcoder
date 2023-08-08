const path = require('node:path')

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación del proyecto',
            description: 'Esta es la documentación del proyecto'
        }
    },
    apis: [path.resolve(`./**/*.yaml`)]
}

module.exports = {
    swaggerOptions
}