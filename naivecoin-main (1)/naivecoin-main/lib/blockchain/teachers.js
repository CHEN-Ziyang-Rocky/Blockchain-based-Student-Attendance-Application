const R = require('ramda');
const Teacher = require('./teacher');

class Teachers extends Array {
    static fromJson(data) {
        let teachers = new Teachers();
        data.forEach((teacherData) => {
            teachers.push(Teacher.fromJson(teacherData));
        });
        return teachers;
    }
}

module.exports = Teachers;
