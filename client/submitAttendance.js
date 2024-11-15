const readline = require('readline');
const path = require('path');
const CryptoEdDSAUtil = require(path.resolve('/Users/yechenwei/Desktop/naivecoin/lib/util/cryptoEdDSAUtil.js'));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter Student ID: ', (studentId) => {
    rl.question('Enter Event ID: ', (eventId) => {
        rl.question('Enter Private Key: ', (privateKey) => {
            const timestamp = Date.now(); 
            const message = `${studentId}${eventId}${timestamp}`;
            const messageHash = CryptoEdDSAUtil.hashMessage(message);

            console.log('Generated hash (for signing):', messageHash);
            console.log('Timestamp:', timestamp);

            const signature = CryptoEdDSAUtil.signHash(privateKey, messageHash);

            const attendanceCertificate = {
                studentId: studentId,
                eventId: eventId,
                timestamp: timestamp,
                signature: signature
            };

            console.log('Generated attendance certificate:', attendanceCertificate);

            // 此处可以选择是否将attendanceCertificate发送到区块链或其他操作
            rl.close();
        });
    });
});
//没用