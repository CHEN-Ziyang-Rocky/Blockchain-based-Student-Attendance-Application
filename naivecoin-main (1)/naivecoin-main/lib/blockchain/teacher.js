const R = require('ramda');
const CryptoUtil = require('../util/cryptoUtil');

class Teacher {
    constructor(id) {
        this.id = id; 
    }

    static fromJson(data) {
        if (typeof data === 'object' && 'id' in data) {
            return new Teacher(data.id);
        }
        throw new Error('Invalid teacher data format');
    }
}

module.exports = Teacher;


