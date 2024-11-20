const readline = require('readline');
const path = require('path');
const CryptoEdDSAUtil = require(path.resolve('../lib/util/cryptoEdDSAUtil.js'));

const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter Student ID: ", (User_ID) => {
    rl.question("Enter Event ID: ", (eventID) => {
        rl.question("Enter your Private Key: ", (privateKey) => {
            const timestamp = Date.now(); 
            const message = `${User_ID}${eventID}${timestamp}`;
            const messageHash = CryptoEdDSAUtil.hashMessage(message);

            console.log("Timestamp:", timestamp);
            
            const signature = CryptoEdDSAUtil.signHash(privateKey, messageHash);
            console.log("Generated Signature:", signature);

            const attendanceData = {
                User_ID: User_ID,
                eventID: eventID,
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
