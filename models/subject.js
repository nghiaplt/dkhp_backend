const BaseModel = require("./base-model");


class Subject extends BaseModel {
    async getToken(subjectId) {
        return await this.knex('monhoc')
            .first('soTinChi')
            .where({ id: subjectId })
    }
    async getLimit(subjectId) {
        return await this.knex('monhoc')
            .first('soLuongSV')
            .where({ id: subjectId })
    }
    async getListRegistered1(studentId) {
        return await this.knex('dangkidot1')
            .select()
            .where({ idSV: studentId })
    }
    async getListRegistered2(studentId) {
        return await this.knex('dangkidot2')
            .select()
            .where({ idSV: studentId })
    }
    async getListSubjectAvailablePhase1(studentId) {
        return await this.knex('monhoc as mh')
            .select('*', 'mh.ten as tenMH', 'gv.ten as tenGV', 'dk1.id as dk1id', 'mh.id as id')
            .count('dk1.id as soLuongSVDaDangKyDot1')
            .innerJoin('giaovien as gv', 'mh.idGV', 'gv.idGv')
            .leftJoin('dangkidot1 as dk1', 'dk1.idMonHoc', 'mh.id')
            .groupBy('mh.id')
            .whereNotIn('mh.id', this.knex('diem')
                .select('idMonHoc')
                .where({ idSV: studentId }))
            .whereNotIn('mh.id',
                // lay hp (co hp tien quyet) ma chua hoc hoc phan tien quyet
                this.knex('monhoc')
                    .select('id')
                    .innerJoin('tienquyet', 'monhoc.id', 'tienquyet.idMonSau')
                    .whereNotIn('id',
                        // lay hp (co hp tien quyet) ma da hoc hoc phan tien quyet
                        this.knex('monhoc')
                            .select('id')
                            .whereIn('id',
                                this.knex('tienquyet')
                                    .select('idMonSau')
                                    .innerJoin('diem', 'tienquyet.idMonTruoc', 'diem.idMonHoc')
                                    .where({ idSV: studentId }))))
    }
    async getListSubjectAvailablePhase2(studentId) {
        return await this.knex('monhoc as mh')
            .select('*', 'mh.ten as tenMH', 'gv.ten as tenGV', 'dk1.id as dk1id', 'mh.id as id')
            .count('dk1.id as soLuongSVDaDangKyDot1')
            .innerJoin('giaovien as gv', 'mh.idGV', 'gv.idGv')
            .leftJoin('dangkidot2 as dk1', 'dk1.idMonHoc', 'mh.id')
            .groupBy('mh.id')
            .whereNotIn('mh.id', this.knex('diem')
                .select('idMonHoc')
                .where({ idSV: studentId }))
            .whereNotIn('mh.id',
                // lay hp (co hp tien quyet) ma chua hoc hoc phan tien quyet
                this.knex('monhoc')
                    .select('id')
                    .innerJoin('tienquyet', 'monhoc.id', 'tienquyet.idMonSau')
                    .whereNotIn('id',
                        // lay hp (co hp tien quyet) ma da hoc hoc phan tien quyet
                        this.knex('monhoc')
                            .select('id')
                            .whereIn('id',
                                this.knex('tienquyet')
                                    .select('idMonSau')
                                    .innerJoin('diem', 'tienquyet.idMonTruoc', 'diem.idMonHoc')
                                    .where({ idSV: studentId }))))
    }
    async getLearntSubjects(studentId) {
        return await this.knex('diem')
            .select()
            .where({ idSV: studentId });
    }
}

module.exports = Subject;