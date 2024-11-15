const CryptoUtil = require('../util/cryptoUtil');  // 引入加密工具
const axios = require('axios');  

// 生成并签署考勤证书
function generateAndSignAttendance(studentId, eventId, privateKey) {
    const attendanceCertificate = {
        studentId: studentId,
        eventId: eventId,
        timestamp: Date.now()
    };
    const signature = CryptoUtil.sign(JSON.stringify(attendanceCertificate), privateKey);
    return {
        ...attendanceCertificate,
        signature: signature
    };
}

// 提交考勤信息到区块链节点
function submitAttendanceToBlockchain(signedAttendanceRecord) {
    const nodeUrl = "http://localhost:3001/blockchain/transactions";
    return axios.post(nodeUrl, signedAttendanceRecord);
}

module.exports = { generateAndSignAttendance, submitAttendanceToBlockchain };
