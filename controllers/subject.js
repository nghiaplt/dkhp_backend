const BaseController = require("./base-controller");

const StudentModel = require("../models/student");
const SubjectModel = require("../models/subject");
const RegisterModel = require("../models/register");


class SubjectController extends BaseController {
    constructor(request, response) {
        super(request, response);
        this.studentId = this.request.headers.authorization;
        this.subjectId = this.request.params.id;

        this.student = new StudentModel();
        this.subject = new SubjectModel();
        this.register = new RegisterModel();
    }
    async registerPhase1() {
        try {
            const allowToken = await this.student.getTokenAllow(this.studentId);
            const subjectToken = await this.subject.getToken(this.subjectId);
            if (allowToken.soTinChi >= subjectToken.soTinChi) {
                const token = allowToken.soTinChi - subjectToken.soTinChi;
                await this.register.registerPhase1(this.subjectId, this.studentId);
                await this.student.updateTokenAllow(this.studentId, token);
                this.sendSuccessResponse({ soTinChi: token });
            } else {
                this.sendFailResponse({ soTinChi: allowToken.soTinChi }, "Bạn không đủ tín chỉ để đăng kí môn học này.");
            }
        }
        catch ($e) {
            this.sendFailResponse([]);
        }
    }
    async registerPhase2() {
        try {
            const subjectLimit = await this.subject.getLimit(this.subjectId);
            const numberStudent = await this.register.getNumberStudent(this.subjectId);
            if (subjectLimit.soLuongSV > numberStudent.count > 0) {
                const allowToken = await this.student.getTokenAllow(this.studentId);
                const subjectToken = await this.subject.getToken(this.subjectId);
                if (allowToken.soTinChi >= subjectToken.soTinChi) {
                    const token = allowToken.soTinChi - subjectToken.soTinChi;
                    await this.register.registerPhase2(this.subjectId, this.studentId);
                    await this.student.updateTokenAllow(this.studentId, token);
                    this.sendSuccessResponse({ soTinChi: token });
                } else {
                    this.sendFailResponse({ soTinChi: allowToken.soTinChi }, "Bạn không đủ tín chỉ để đăng kí môn học này.");
                }
            } else {
                this.sendFailResponse([], "Môn học đã đủ số lượng sinh viên");
            }
        }
        catch ($e) {
            this.sendFailResponse([]);
        }
    }
    async getListRegistered1() {
        try {
            const data = await this.subject.getListRegistered1(this.studentId);
            this.sendSuccessResponse(data);
        }
        catch ($e) {
            this.sendFailResponse([]);
        }
    }
    async getListRegistered2() {
        try {
            const data = await this.subject.getListRegistered2(this.studentId);
            this.sendSuccessResponse(data);
        }
        catch ($e) {
            this.sendFailResponse([]);
        }
    }
    async cancelRegisterPhase1() {
        try {
            const allowToken = await this.student.getTokenAllow(this.studentId);
            const subjectToken = await this.subject.getToken(this.subjectId);
            const token = allowToken.soTinChi + subjectToken.soTinChi;
            await this.register.cancelRegisterPhase1(this.subjectId, this.studentId);
            await this.student.updateTokenAllow(this.studentId, token);
            this.sendSuccessResponse({ soTinChi: token });
        }
        catch ($e) {
            this.sendFailResponse([]);
        }
    }
    async cancelRegisterPhase2() {
        try {
            const allowToken = await this.student.getTokenAllow(this.studentId);
            const subjectToken = await this.subject.getToken(this.subjectId);
            const token = allowToken.soTinChi + subjectToken.soTinChi;
            await this.register.cancelRegisterPhase2(this.subjectId, this.studentId);
            await this.student.updateTokenAllow(this.studentId, token);
            this.sendSuccessResponse({ soTinChi: token });
        }
        catch ($e) {
            this.sendFailResponse([]);
        }
    }
    async getListSubjectAvailablePhase1() {
        try {
            const data = await this.subject.getListSubjectAvailablePhase1(this.studentId);
            this.sendSuccessResponse(data);
        }
        catch ($e) {
            this.sendFailResponse([]);
        }
    }
    async getListSubjectAvailablePhase2() {
        try {
            const data = await this.subject.getListSubjectAvailablePhase2(this.studentId);
            this.sendSuccessResponse(data);
        }
        catch ($e) {
            this.sendFailResponse([]);
        }
    }
    async getLeartSubjects() {
        try {
            const data = await this.subject.getLearntSubjects(this.studentId);
            this.sendSuccessResponse(data);
        }
        catch ($e) {
            this.sendFailResponse([]);
        }
    }
}

module.exports = SubjectController;