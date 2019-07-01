const BaseModel = require("./base-model");


class StudentModel extends BaseModel {
    async getListStudent() {
        return await this.knex('sinhvien')
            .select()
    }
    async getStudentDetail(id) {
        return await this.knex('sinhvien')
            .select()
            .where({ id: id })
            .join('khoa', 'sinhvien.idKhoa', 'khoa.idk')
    }
    async getTokenAllow(studentId) {
        return await this.knex('sotinchichophep')
            .first('soTinChi')
            .where({ idSV: studentId })
    }
    async updateTokenAllow(studentId, token) {
        return await this.knex('sotinchichophep')
            .where({ idSV: studentId })
            .update({ soTinChi: token });
    }
    async getRoadmap() {
        return await this.knex('tienquyet as tq')
            .select(
                'mh2.ten as monChinh',
                'mh1.ten as tienQuyet',
                'mh2.id as idSau',
                'mh1.id as idTruoc'
            )
            .innerJoin('monhoc as mh1', 'mh1.id', 'tq.idMonTruoc')
            .innerJoin('monhoc as mh2', 'mh2.id', 'tq.idMonSau')
    }
    async getRootArray() {
        return await this.knex('monhoc')
            .select('id', 'ten')
            .whereNotIn('id', this.knex('tienquyet')
                .select('idMonTruoc'))
    }
}

module.exports = StudentModel;