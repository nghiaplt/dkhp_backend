const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
// const dbConfig = require('./configs/db')
// var knex = require('knex')(dbConfig);

const app = express()
const port = 8222

var corsOptions = {
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const StudenController = require('./controllers/student');
const SubjectController = require('./controllers/subject');
const RegisterController = require('./controllers/register');


app.get('/students', (request, response) => {
    const studentController = new StudenController(request, response);
    studentController.getListStudent();
})
app.get('/student/:id', (request, response) => {
    const studentController = new StudenController(request, response);
    studentController.getStudentDetail();
})

app.post('/subject/:id/register/phase1', (request, response) => {
    const subjectController = new SubjectController(request, response);
    subjectController.registerPhase1();
})

app.post('/subject/:id/register/phase2', (request, response) => {
    const subjectController = new SubjectController(request, response);
    subjectController.registerPhase2();

})

app.get('/subjects/registered/phase1', (request, response) => {
    const subjectController = new SubjectController(request, response);
    subjectController.getListRegistered1();
})

app.get('/subjects/registered/phase2', (request, response) => {
    const subjectController = new SubjectController(request, response);
    subjectController.getListRegistered2();
})


app.post('/subject/:id/register/cancel/phase1', (request, response) => {
    const subjectController = new SubjectController(request, response);
    subjectController.cancelRegisterPhase1();

})
app.post('/subject/:id/register/cancel/phase2', (request, response) => {
    const subjectController = new SubjectController(request, response);
    subjectController.cancelRegisterPhase2();

})

app.get('/subjects/available/phase1', (request, response) => {
    const subjectController = new SubjectController(request, response);
    subjectController.getListSubjectAvailablePhase1();
})
app.get('/subjects/available/phase2', (request, response) => {
    const subjectController = new SubjectController(request, response);
    subjectController.getListSubjectAvailablePhase2();
})


app.get('/roadmap', (request, response) => {
    const studentController = new StudenController(request, response);
    studentController.getRoadmap();
});

app.post('/move/phase2', (request, response) => {
    const registerController = new RegisterController(request, response);
    registerController.movePhase2();
    // knex('dangkidot1')
    //     .select('idMonHoc')
    //     .groupBy('idMonHoc')
    //     .then(ls => {
    //         ls.forEach(l => {
    //             getLimit(l.idMonHoc, limit_ => {
    //                 knex('monhoc')
    //                     .select('monhoc.id as idmonhoc', 'monhoc.ten as tenmonhoc', 'monhoc.soTinChi as stc', 'monhoc.soLuongSV as soluongsv', 't3.idSV as idsv', 't3.dtb')
    //                     .join(
    //                         knex('dangkidot1')
    //                             .select('dangkidot1.idMonHoc', 'dangkidot1.idSV as idsv', 't2.dtb')
    //                             .join(
    //                                 //tinh diem trung binh
    //                                 knex.select('t1.idSV', knex.raw('sum(diemt)/sum(soTinChi) as dtb'))
    //                                     .from(function () {
    //                                         this.select('diem.idSV', 'diem.diem', 'monhoc.id as idmonhoc', 'monhoc.soTinChi',
    //                                             knex.raw('diem.diem * monhoc.soTinChi as diemt'))
    //                                             .from('monhoc')
    //                                             .join('diem', 'monhoc.id', 'diem.idMonHoc')
    //                                             .as('t1')
    //                                     }).groupBy('t1.idSV').as('t2'),

    //                                 't2.idSV', 'dangkidot1.idSV')
    //                             .where({ idMonHoc: l.idMonHoc })
    //                             .as('t3')
    //                         // end tinh dtb
    //                         , 'monhoc.id', 't3.idMonHoc')
    //                     .limit(limit_[0].soLuongSV)
    //                     .orderBy('dtb', 'desc')
    //                     .then(xs => {
    //                         xs.forEach(x => {
    //                             knex('dangkidot2')
    //                                 .insert({ idMonHoc: x.idmonhoc, idSV: x.idsv })
    //                                 .then(() => {
    //                                     response.json({ success: true })
    //                                 })
    //                         })
    //                     })
    //             })
    //         })
    //     })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))







// function getLimit(idmh_, callback) {
//     knex('monhoc').select('soLuongSV').where({ id: idmh_ }).then(x => {
//         callback(x)
//     })
// }

