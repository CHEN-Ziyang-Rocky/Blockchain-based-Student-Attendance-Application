const R = require('ramda');
const Teacher = require('./teacher');

class Teachers extends Array {
    static fromJson(data) {
        let teachers = new Teachers();
        R.forEach((teacher) => { teachers.push(Teacher.fromJson(teacher)); }, data);
        return teachers;
    }
}

module.exports = Teachers;