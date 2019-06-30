const BaseModel = require("./base-model");


class RegisterModel extends BaseModel {
    async registerPhase1(subjectId, studentId) {
        return await this.knex('dangkidot1')
            .insert({ idMonHoc: subjectId, idSV: studentId })
    }
    async registerPhase2(subjectId, studentId) {
        return await this.knex('dangkidot2')
            .insert({ idMonHoc: subjectId, idSV: studentId })
    }
    async getNumberStudent(subjectId) {
        return await this.knex('dangkidot2')
            .first(this.knex.raw('count(*) as count'))
            .where({ idMonHoc: subjectId })
    }
    async cancelRegisterPhase1(subjectId, studentId) {
        return await this.knex('dangkidot1')
            .where({ idMonHoc: subjectId, idSV: studentId })
            .del()
    }
    async cancelRegisterPhase2(subjectId, studentId) {
        return await this.knex('dangkidot2')
            .where({ idMonHoc: subjectId, idSV: studentId })
            .del()
    }
    async calculateAverageGradeEachSubject(registerPhase1, limit) {
        var self = this;
        return await this.knex('monhoc')
            .select('monhoc.id as idmonhoc', 'monhoc.ten as tenmonhoc', 'monhoc.soTinChi as stc', 'monhoc.soLuongSV as soluongsv', 't3.idSV as idsv', 't3.dtb')
            .join(
                self.knex('dangkidot1')
                    .select('dangkidot1.idMonHoc', 'dangkidot1.idSV as idsv', 't2.dtb')
                    .join(
                        //tinh diem trung binh
                        self.knex.select('t1.idSV', self.knex.raw('sum(diemt)/sum(soTinChi) as dtb'))
                            .from(function () {
                                this.select('diem.idSV', 'diem.diem', 'monhoc.id as idmonhoc', 'monhoc.soTinChi',
                                    self.knex.raw('diem.diem * monhoc.soTinChi as diemt'))
                                    .from('monhoc')
                                    .join('diem', 'monhoc.id', 'diem.idMonHoc')
                                    .as('t1')
                            }).groupBy('t1.idSV').as('t2'),
                        't2.idSV', 'dangkidot1.idSV')
                    .where({ idMonHoc: registerPhase1.idMonHoc })
                    .as('t3')
                // end tinh dtb
                , 'monhoc.id', 't3.idMonHoc')
            .limit(limit.soLuongSV)
            .orderBy('dtb', 'desc')
    }
    async selectDistinctSubject() {
        return await this.knex('dangkidot1')
            .select('idMonHoc')
            .groupBy('idMonHoc');
    }
}

module.exports = RegisterModel;