const express = require('express')
const dbConfig = require('./configs/db')
const bodyParser = require('body-parser')
var cors = require('cors')
var knex = require('knex')(dbConfig);

const app = express()
const port = 8222

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/subject', (request, response) => {
    //send JSON object
    knex.select().from('subjects')
        .then((result) => {
            response.json({ success: true, data: result });
        })
})

app.post('/subject', (request, response) => {
    data = request.body;
    //send JSON object
    knex('subjects').insert(data)
        .then(result => {
            response.json({ success: true });
        })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))