const Blockchain = require('./index'); 
const Teacher = require('./teacher');

const blockchain = new Blockchain('testDb');

console.log('--- Testing Add Teacher ---');
const teacher1 = new Teacher('123456t');

blockchain.addTeacher(teacher1);