const dbConfig = require('../configs/db')
const knex = require('knex')(dbConfig);


class BaseModel {
    constructor() {
        this.knex = knex;
    }
}

module.exports = BaseModel;