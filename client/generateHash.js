const readline = require('readline');
const path = require('path');
const CryptoEdDSAUtil = require(path.resolve('/Users/yechenwei/Desktop/naivecoin/lib/util/cryptoEdDSAUtil.js'));

const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter Student ID: ", (studentId) => {
    rl.question("Enter Event ID: ", (eventId) => {
        rl.question("Enter your Private Key: ", (privateKey) => {
            const timestamp = Date.now(); 
            const message = `${studentId}${eventId}${timestamp}`;
            const messageHash = CryptoEdDSAUtil.hashMessage(message);

            console.log("Timestamp:", timestamp);
            
            const signature = CryptoEdDSAUtil.signHash(privateKey, messageHash);
            console.log("Generated Signature:", signature);

            const attendanceData = {
                studentId: studentId,
                eventId: eventId,
                timestamp: timestamp,
                messageHash: messageHash,
                signature: signature 
            };

            fs.writeFileSync('attendanceData.json', JSON.stringify(attendanceData, null, 2));
            console.log('Attendance data saved to attendanceData.json');
            
            rl.close();
        });
    });
});
