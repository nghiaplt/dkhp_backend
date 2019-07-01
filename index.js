const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

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
})

app.get('/subjects/learnt', (request, response) => {
    const subjectController = new SubjectController(request, response);
    subjectController.getLeartSubjects();
})

app.post('/delete/phase2', (request, response) => {
    const registerController = new RegisterController(request, response);
    registerController.deleteRegisterPhase2();
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))







// function getLimit(idmh_, callback) {
//     knex('monhoc').select('soLuongSV').where({ id: idmh_ }).then(x => {
//         callback(x)
//     })
// }

