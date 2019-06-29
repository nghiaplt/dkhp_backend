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
    knex.select().from('monhoc').where({id:request.params.id})
    .join('giaovien','monhoc.idGV','giaovien.idGv')
    .then((r)=>{
        response.send({success:true, data: r})
    })
})

app.get('/subject/:id/registered-student',(request,response)=>{
    knex('dangkidot1').join('sinhvien', 'dangkidot1.idSV','sinhvien.id').select().where({idMonHoc:request.params.id}).then((r)=>{
        response.json({success:true, data:r})
    })
})

app.get('/subject/:id/prerequisite-subjects', (request,response)=>{
    knex('tienquyet').join('monhoc','tienquyet.idMonTruoc','monhoc.id').select().where({idMonSau:request.params.id}).then((r)=>{
        response.json({success:true, data:r})
    })
})

app.post('/subject/:id/register/phase1', (request, response) => {
    
    knex('sotinchichophep').select('soTinChi').where({idSV: request.headers.authorization})
    .then(a=>{
        knex('monhoc').select('soTinChi').where({id:request.params.id})
        .then(b=>{
            if(a[0].soTinChi >= b[0].soTinChi){
                knex('dangkidot1').insert({idMonHoc: request.params.id , idSV: request.headers.authorization})
                .then(() => {
                    knex('sotinchichophep').where({idSV: request.headers.authorization})
                    .update({soTinChi: a[0].soTinChi - b[0].soTinChi})
                    .then(()=>{
                        response.json({ success: true });
                    })
                })
            }
            else response.json({success:false});
        }) 
    })
})


app.post('/subject/:id/register/cancel', (request, response) => {
    
    

    knex('sotinchichophep').select('soTinChi').where({idSV: request.headers.authorization})
    .then(a=>{
        knex('monhoc').select('soTinChi').where({id:request.params.id})
        .then(b=>{
            knex('dangkidot1').where({idMonHoc: request.params.id , idSV: request.headers.authorization}).del()
            .then(() => {
                knex('sotinchichophep').where({idSV: request.headers.authorization})
                .update({soTinChi: a[0].soTinChi + b[0].soTinChi})
                .then(()=>{
                    response.json({ success: true });
                })
            })
        }) 
    })
})



app.get('/test',(request, response)=>{
    
    
});


app.get('/subjects/available/phase1',(request, response)=>{
    //lay hp chua co diem
    knex('monhoc').select().whereNotIn('id',knex('diem').select('idMonHoc')
    .where({idSV:request.headers.authorization})).whereNotIn('id',

            // lay hp (co hp tien quyet) ma chua hoc hoc phan tien quyet 

        knex('monhoc').select('id').innerJoin('tienquyet','monhoc.id','tienquyet.idMonSau').whereNotIn('id',

        // lay hp (co hp tien quyet) ma da hoc hoc phan tien quyet
        knex('monhoc').select('id').whereIn('id',
        knex.select('idMonSau').from('tienquyet').innerJoin('diem', 'tienquyet.idMonTruoc','diem.idMonHoc')
        .where({idSV: request.headers.authorization})))

        ).then(t=>{
            response.json({ success: true , data: t})
        })
        
 
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))