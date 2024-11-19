const R = require('ramda');
const CryptoUtil = require('../util/cryptoUtil');

class Teacher {
    constructor(id) {
        this.id = id; 
    }

    static fromJson(data) {
        let teacher = new Teacher();
        Object.assign(teacher, data);
        return teacher;
    }
}

module.exports = Teacher;
