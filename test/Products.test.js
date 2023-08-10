const mongoose = require('mongoose')
const ProductManagerMongo = require('../src/DAO/db/products.Manager.Mongo')
const Assert = require('assert')
require('dotenv').config()

mongoose.connect(process.env.MONGO_TEST_URL)

const assert = Assert.strict

describe('ProductManagerMongo testing', () => {
    before(function(){
        this.ProductManagerMongo = new ProductManagerMongo()
    })
    beforeEach(function(){
        this.timeout(2000)
    })
    it('El dao debe traer 10 productos correctamente de la DB',async function(){
        const result = await this.ProductManagerMongo.getAll(10,1,{},{})
        console.log('result',result)
        assert.equal(result.payload.length,10)
    })
})