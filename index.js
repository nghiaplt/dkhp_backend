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





app.get('/subjects', (request,response)=>{
    knex.select().from('monhoc').then((monhoc)=>{
        response.json({success:true,data:monhoc})
    })
})

app.get('/subject/:id', (request, response)=>{
    knex.select().from('monhoc').where({id:request.params.id}).then((r)=>{
        response.json({success:true, data: r})
    })
})

app.get('/subject/:id/registered-student',(request,response)=>{
    knex('dangkidot1').join('sinhvien', 'dangkidot1.idSV','sinhvien.id').select().where({idMonHoc:request.params.id}).then((r)=>{
        response.json({success:true, data:r})
    })
})

app.get('/subject/:id/prerequisite-subjects', (request,response)=>{
    knex('tienquyet').join('monhoc','tienquyet.idMonHocYeuCau','monhoc.id').select().where({idMonHoc:request.params.id}).then((r)=>{
        response.json({success:true, data:r})
    })
})

app.post('/subject/:id/register', (request, response) => {
    knex('dangkidot1').insert({idMonHoc: request.params.id , idSV: request.headers.userid}).then(r => {
        response.json({ success: true });
    })
})


app.post('/subject/:id/register/cancel', (request, response) => {
    knex('dangkidot1').where({idMonHoc: request.params.id , idSV: request.headers.userid}).del().then(r => {
        response.json({ success: true });
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))