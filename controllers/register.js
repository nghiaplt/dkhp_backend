const BaseController = require("./base-controller");
const RegisterModel = require("../models/register");
const SubjectModel = require("../models/subject");


class RegisterController extends BaseController {
    constructor(request, response) {
        super(request, response);
        this.register = new RegisterModel();
        this.subject = new SubjectModel();
    }
    async movePhase2() {
        try {
            const subjects = await this.register.selectDistinctSubject();
            subjects.forEach(async (subject) => {
                const limit = await this.subject.getLimit(subject.idMonHoc);
                const data = await this.register.calculateAverageGradeEachSubject(subject, limit);
                data.forEach(async (item) => {
                    await this.register.registerPhase2(item.idmonhoc, item.idsv);
                })
            })
            this.sendSuccessResponse({});
        }
        catch ($e) {
            console.log($e);
            this.sendFailResponse([]);
        }
    }

    async deleteRegisterPhase2() {
        try {
            await this.register.deleteRegisterPhase2();
            this.sendSuccessResponse([]);
        }
        catch ($e) {
            this.sendFailResponse([]);
        }
    }
}

module.exports = RegisterController;