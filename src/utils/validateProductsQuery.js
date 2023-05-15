const Ajv = require('ajv')

const ajv = new Ajv()

const schema = {
    type: 'object',
    properties: {
        limit: { type: 'integer', minimum: 1, maximum: 100 },
        page: { type: 'integer', minimum: 1, maximum: 100 },
        priceSort: { type: 'string', enum: ['asc', 'desc'] },
        category: { type: 'string'},
        availability: { type: 'string'}
    }
}

const validate = ajv.compile(schema);

exports.module = {validate}