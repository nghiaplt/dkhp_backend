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





app.get('/subjects', (req,res)=>{
    knex.select().from('monhoc').then((monhoc)=>{
        res.json({success:true,data:monhoc})
    })
})

app.get('/subjects/:id', (req, res)=>{
    knex.select().from('monhoc').where({id:req.params.id}).then((r)=>{
        res.json({success:true, data: r})
    })
})

app.get('/subject/:id/registered-student',(req,res)=>{
    knex('dangkidot1').join('sinhvien', 'dangkidot1.idSV','sinhvien.id').select().where({idMonHoc:req.params.id}).then((r)=>{
        res.json({success:true, data:r})
    })
})

app.get('/subject/:id/prerequisite-subjects', (req,res)=>{
    knex('tienquyet').join('monhoc','tienquyet.idMonHocYeuCau','monhoc.id').select().where({idMonHoc:req.params.id}).then((r)=>{
        res.json({success:true, data:r})
    })
})

app.post('/subject/:id/register', (req, res) => {
    knex('dangkidot1').insert({idMonHoc: req.params.id , idSV: req.headers.userid}).then(r => {
        res.json({ success: true });
    })
})


app.post('/subject/:id/register/cancel', (req, res) => {
    knex('dangkidot1').where({idMonHoc: req.params.id , idSV: req.headers.userid}).del().then(r => {
        res.json({ success: true });
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))