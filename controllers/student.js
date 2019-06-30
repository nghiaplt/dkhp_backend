const BaseController = require("./base-controller");
const StudentModel = require("../models/student");


class StudentController extends BaseController {
    constructor(request, response) {
        super(request, response);
        this.student = new StudentModel();
    }
    async getListStudent() {
        try {
            const data = await this.student.getListStudent();
            this.sendSuccessResponse(data);
        }
        catch ($e) {
            this.sendFailResponse([]);
        }
    }
    async getStudentDetail() {
        try {
            const data = await this.student.getStudentDetail(this.request.params.id);
            this.sendSuccessResponse(data);
        }
        catch ($e) {
            this.sendFailResponse([]);
        }
    }
    async getRoadmap() {
        try {
            const result = await this.student.getRoadmap();
            const group = _.groupBy(result, 'idSau');
            const arrayLv1 = _.map(group, (item, key) => {
                return {
                    id: key,
                    tienquyet: (item).map(element => ({ id: element.idTruoc, ten: element.tienQuyet, tienquyet: [] })),
                    ten: item[0].monChinh
                }
            })

            const arrayRoot = await this.student.getRootArray();
            const arrayNested = _.map(arrayLv1, item => {
                item.tienquyet = _.map(item.tienquyet, tienquyet => {
                    newtienquyet = _.find(arrayLv1, itemlv1 => tienquyet.id == itemlv1.id);
                    tienquyet = newtienquyet === undefined ? tienquyet : newtienquyet;
                    return tienquyet;
                })
                return item;
            })
            const kq = _.map(arrayRoot, root => {
                return _.find(arrayNested, neseted => root.id == neseted.id);
            })

            this.sendSuccessResponse(kq);
        }
        catch ($e) {
            this.sendFailResponse([]);
        }
    }
}

module.exports = StudentController;