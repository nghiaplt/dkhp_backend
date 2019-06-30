const express = require('express')
const dbConfig = require('./configs/db')
const bodyParser = require('body-parser')
var cors = require('cors')
var knex = require('knex')(dbConfig);
var _ = require('lodash');

const app = express()
const port = 8222

var corsOptions = {
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())



app.get('/students', (request, response) => {
    knex('sinhvien').select()
        .then((a) => {
            response.json({ success: true, data: a })
        })
})
app.get('/student/:id', (request, response) => {
    knex.select().from('sinhvien').where({ id: request.params.id })
        .join('khoa', 'sinhvien.idKhoa', 'khoa.idk')
        .then((r) => {
            response.send({ success: true, data: r })
        })
})

app.post('/subject/:id/register/phase1', (request, response) => {

    knex('sotinchichophep').select('soTinChi').where({ idSV: request.headers.authorization })
        .then(a => {
            knex('monhoc').select('soTinChi').where({ id: request.params.id })
                .then(b => {
                    if (a[0].soTinChi >= b[0].soTinChi) {
                        knex('dangkidot1').insert({ idMonHoc: request.params.id, idSV: request.headers.authorization })
                            .then(() => {
                                knex('sotinchichophep').where({ idSV: request.headers.authorization })
                                    .update({ soTinChi: a[0].soTinChi - b[0].soTinChi })
                                    .then(() => {
                                        response.json({ success: true });
                                    })
                            })
                    }
                    else response.json({ success: false });
                })
        })
})

app.post('/subject/:id/register/phase2', (request, response) => {

})

app.get('/subjects/registered/phase1', (request, response) => {
    let user_id = request.headers.authorization;
    knex('dangkidot1').select().where({ idSV: user_id })
        .then(result => {
            response.json({ success: true, data: result })
        })
})

app.get('/subjects/registered/phase2', (request, response) => {
    let user_id = request.headers.authorization;
    knex('dangkidot2').select().where({ idSV: user_id })
        .then(result => {
            response.json({ success: true, data: result })
        })
})


app.post('/subject/:id/register/cancel/phase1', (request, response) => {
    knex('sotinchichophep').select('soTinChi').where({ idSV: request.headers.authorization })
        .then(a => {
            knex('monhoc').select('soTinChi').where({ id: request.params.id })
                .then(b => {
                    knex('dangkidot1').where({ idMonHoc: request.params.id, idSV: request.headers.authorization }).del()
                        .then(() => {
                            knex('sotinchichophep').where({ idSV: request.headers.authorization })
                                .update({ soTinChi: a[0].soTinChi + b[0].soTinChi })
                                .then(() => {
                                    response.json({ success: true });
                                })
                        })
                })
        })
})
app.post('/subject/:id/register/cancel/phase2', (request, response) => {

})



app.get('/subjects/available/phase1', (request, response) => {
    //lay hp chua co diem
    knex('monhoc as mh')
        .select('*', 'mh.ten as tenMH', 'gv.ten as tenGV', 'dk1.id as dk1id', 'mh.id as id')
        .count('mh.id as soLuongSVDaDangKyDot1')
        .innerJoin('giaovien as gv', 'mh.idGV', 'gv.idGv')
        .innerJoin('dangkidot1 as dk1', 'dk1.idMonHoc', 'mh.id')
        .groupBy('mh.id')
        .whereNotIn('mh.id', knex('diem')
            .select('idMonHoc')
            .where({ idSV: request.headers.authorization }))
        .whereNotIn('mh.id',
            // lay hp (co hp tien quyet) ma chua hoc hoc phan tien quyet
            knex('monhoc').select('id').innerJoin('tienquyet', 'monhoc.id', 'tienquyet.idMonSau').whereNotIn('id',

                // lay hp (co hp tien quyet) ma da hoc hoc phan tien quyet
                knex('monhoc').select('id').whereIn('id',
                    knex.select('idMonSau').from('tienquyet').innerJoin('diem', 'tienquyet.idMonTruoc', 'diem.idMonHoc')
                        .where({ idSV: request.headers.authorization })))

        ).then(t => {
            response.json({ success: true, data: t })
        })
})

app.get('/subjects/available/phase2', (request, response) => {

})

app.get('/roadmap', (request, response) => {
    knex('tienquyet as tq')
        .select(
            'mh2.ten as monChinh',
            'mh1.ten as tienQuyet',
            'mh2.id as idSau',
            'mh1.id as idTruoc'
        )
        .innerJoin('monhoc as mh1', 'mh1.id', 'tq.idMonTruoc')
        .innerJoin('monhoc as mh2', 'mh2.id', 'tq.idMonSau')
        .then(result => {
            const group = _.groupBy(result, 'idSau');
            const arrayLv1 = _.map(group, (item, key) => {
                return {
                    id: key,
                    tienquyet: (item).map(element => ({ id: element.idTruoc, ten: element.tienQuyet, tienquyet: [] })),
                    ten: item[0].monChinh
                }
            })
            knex('monhoc')
                .select('id', 'ten')
                .whereNotIn('id', knex('tienquyet').select('idMonTruoc'))
                .then(arrayRoot => {
                    const arrayNested = _.map(arrayLv1, item => {
                        // console.log(item);
                        item.tienquyet = _.map(item.tienquyet, tienquyet => {
                            // console.log(tienquyet);
                            newtienquyet = _.find(arrayLv1, itemlv1 => tienquyet.id == itemlv1.id);
                            tienquyet = newtienquyet === undefined ? tienquyet : newtienquyet;
                            return tienquyet;
                        })
                        return item;
                    })
                    const kq = _.map(arrayRoot, root => {
                        return _.find(arrayNested, neseted => root.id == neseted.id);
                    })
                    response.json({ success: true, data: kq });
                })
        })

});

app.post('/move/phase2', (request, response) => {
    // knex('dangkidot1').select('idMonHoc')
    knex('dangkidot1').select('idMonHoc').groupBy('idMonHoc').then(ls => {
        ls.forEach(l => {
            getLimit(l.idMonHoc, limit_ => {
                knex.select('monhoc.id as idmonhoc', 'monhoc.ten as tenmonhoc', 'monhoc.soTinChi as stc', 'monhoc.soLuongSV as soluongsv', 't3.idSV as idsv', 't3.dtb')
                    .from('monhoc')
                    .join(

                        knex.select('dangkidot1.idMonHoc', 'dangkidot1.idSV as idsv', 't2.dtb')
                            .from('dangkidot1')
                            .join(

                                //tinh diem trung binh
                                knex.select('t1.idSV', knex.raw('sum(diemt)/sum(soTinChi) as dtb'))
                                    .from(function () {
                                        this.select('diem.idSV', 'diem.diem', 'monhoc.id as idmonhoc', 'monhoc.soTinChi',
                                            knex.raw('diem.diem * monhoc.soTinChi as diemt'))
                                            .from('monhoc').join('diem', 'monhoc.id', 'diem.idMonHoc').as('t1')
                                    }).groupBy('t1.idSV').as('t2'),

                                't2.idSV', 'dangkidot1.idSV')
                            .where({ idMonHoc: l.idMonHoc })
                            .as('t3')
                        // end tinh dtb


                        , 'monhoc.id', 't3.idMonHoc')
                    .limit(limit_[0].soLuongSV)
                    .orderBy('dtb', 'desc')

                    .then(xs => {
                        xs.forEach(x => {
                            knex('dangkidot2').insert({ idMonHoc: x.idmonhoc, idSV: x.idsv })
                                .then(() => {
                                    response.json({ success: true })
                                })
                        })
                    })
            })
        })
    })


})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))







function getLimit(idmh_, callback) {
    knex('monhoc').select('soLuongSV').where({ id: idmh_ }).then(x => {
        callback(x)
    })
}


app.get('/test', (request, response) => {
    knex('dangkidot1').select('idMonHoc').groupBy('idMonHoc').then((x) => response.json(x))

    // // move phase 1 sang phase 2 nhung mon co id la 1
    // getLimit(1,limit_=>{
    //     knex.select('monhoc.id as idmonhoc','monhoc.ten as tenmonhoc', 'monhoc.soTinChi as stc','monhoc.soLuongSV as soluongsv','t3.idSV as idsv','t3.dtb')
    //     .from('monhoc')
    //     .join(

    //     knex.select('dangkidot1.idMonHoc','dangkidot1.idSV as idsv','t2.dtb')
    //     .from('dangkidot1')
    //     .join(

    //     //tinh diem trung binh
    //     knex.select('t1.idSV',knex.raw('sum(diemt)/sum(soTinChi) as dtb'))
    //     .from(function(){
    //         this.select('diem.idSV','diem.diem','monhoc.id as idmonhoc', 'monhoc.soTinChi',
    //         knex.raw('diem.diem * monhoc.soTinChi as diemt'))
    //         .from('monhoc').join('diem','monhoc.id','diem.idMonHoc').as('t1')
    //     }).groupBy('t1.idSV').as('t2') ,

    //     't2.idSV','dangkidot1.idSV')
    //     .where({idMonHoc:1})
    //     .as('t3')

    //     , 'monhoc.id','t3.idMonHoc')
    //     .limit(limit_[0].soLuongSV)
    //     .orderBy('dtb','desc')

    //     .then(xs=>{
    //         xs.forEach(x=>{
    //             console.log(x)
    //         })

    //         response.json(xs);
    //     })
    // })
})

// app.get('/subject/:id', (request, response) => {
//     knex.select().from('monhoc').where({ id: request.params.id })
//         .join('giaovien', 'monhoc.idGV', 'giaovien.idGv')
//         .then((r) => {
//             response.send({ success: true, data: r })
//         })
// })

// app.get('/subject/:id/registered-student', (request, response) => {
//     knex('dangkidot1').join('sinhvien', 'dangkidot1.idSV', 'sinhvien.id').select().where({ idMonHoc: request.params.id }).then((r) => {
//         response.json({ success: true, data: r })
//     })
// })

// app.get('/subject/:id/prerequisite-subjects', (request, response) => {
//     knex('tienquyet').join('monhoc', 'tienquyet.idMonTruoc', 'monhoc.id').select().where({ idMonSau: request.params.id }).then((r) => {
//         response.json({ success: true, data: r })
//     })
// })