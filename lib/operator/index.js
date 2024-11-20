const R = require('ramda');
const Wallets = require('./wallets');
const Wallet = require('./wallet');
const Transaction = require('../blockchain/transaction');
const TransactionBuilder = require('./transactionBuilder');
const Db = require('../util/db');
const ArgumentError = require('../util/argumentError');
const Config = require('../config');
const CryptoEdDSAUtil = require('../util/cryptoEdDSAUtil');

const OPERATOR_FILE = 'wallets.json';

class Operator {
    constructor(dbName, blockchain) {
        this.db = new Db('data/' + dbName + '/' + OPERATOR_FILE, new Wallets());

        // INFO: In this implementation the database is a file and every time data is saved it rewrites the file, probably it should be a more robust database for performance reasons
        this.wallets = this.db.read(Wallets);
        this.blockchain = blockchain;
    }

    addWallet(wallet) {
        this.wallets.push(wallet);
        this.db.write(this.wallets);
        return wallet;
    }

    createWalletFromPassword(password) {
        let newWallet = Wallet.fromPassword(password);
        return this.addWallet(newWallet);
    }    

    checkWalletPassword(walletId, passwordHash) {
        let wallet = this.getWalletById(walletId);
        if (wallet == null) throw new ArgumentError(`Wallet not found with id '${walletId}'`);

        return wallet.passwordHash == passwordHash;
    }

    getWallets() {
        return this.wallets;
    }

    getWalletById(walletId) {
        return R.find((wallet) => { return wallet.id == walletId; }, this.wallets);
    }

    generateAddressForWallet(walletId) {
        let wallet = this.getWalletById(walletId);
        if (wallet == null) throw new ArgumentError(`Wallet not found with id '${walletId}'`);

        let address = wallet.generateAddress();
        this.db.write(this.wallets);
        return address;
    }

    getAddressesForWallet(walletId) {
        let wallet = this.getWalletById(walletId);
        if (wallet == null) throw new ArgumentError(`Wallet not found with id '${walletId}'`);

        let addresses = wallet.getAddresses();
        return addresses;
    }    

    getBalanceForAddress(addressId) {        
        let utxo = this.blockchain.getUnspentTransactionsForAddress(addressId);

        if (utxo == null || utxo.length == 0) throw new ArgumentError(`No transactions found for address '${addressId}'`);
        return R.sum(R.map(R.prop('amount'), utxo));
    }

    createTransaction(walletId, fromAddressId, toAddressId, amount, changeAddressId) {
        let utxo = this.blockchain.getUnspentTransactionsForAddress(fromAddressId);
        let wallet = this.getWalletById(walletId);

        if (wallet == null) throw new ArgumentError(`Wallet not found with id '${walletId}'`);

        let secretKey = wallet.getSecretKeyByAddress(fromAddressId);

        if (secretKey == null) throw new ArgumentError(`Secret key not found with Wallet id '${walletId}' and address '${fromAddressId}'`);

        let tx = new TransactionBuilder();
        tx.from(utxo);
        tx.to(toAddressId, amount);
        tx.change(changeAddressId || fromAddressId);
        tx.fee(Config.FEE_PER_TRANSACTION);
        tx.sign(secretKey);        

        return Transaction.fromJson(tx.build());
    }

    async User_register(User_ID, password) {
        const newWallet = this.createWalletFromPassword(password);
        const publicKeyAddress = this.generateAddressForWallet(newWallet.id);

        //console.log(`Student ${User_ID} registered as a miner with wallet ID: ${newWallet.id} and address: ${publicKeyAddress}`);
        const registrationTransaction = {
            id: `reg_${User_ID}`,
            type: 'registration',
            data: {
                inputs: [],                   
                outputs: [                    
                    {
                        User_ID: User_ID, 
                        publicKey: publicKeyAddress, 
                        amount: 0,
                        address: NaN
                    }
                ]
            }
        };
        //console.log("test", registrationTransaction);

        await this.blockchain.addTransaction(registrationTransaction);
        console.log("newWallet:", newWallet);
        console.log("publicKeyAddress:", publicKeyAddress);
        console.log(`Student ${User_ID} registered with wallet ID: ${newWallet.id} and public address: ${publicKeyAddress}`);
        
        return { 
            User_ID: User_ID,
            walletID: newWallet.id, 
            publicKey: publicKeyAddress
        };
    }
    async recordAttendance(User_ID, eventID, timestamp, signature) {
        const attendanceTransaction = {
            id: `${User_ID}_${eventID}_${timestamp}`,
            type: 'attendance',
            data: {
                inputs: [],                   
                outputs: [                    
                    {
                        User_ID: User_ID, 
                        eventID: eventID,
                        timestamp: timestamp,
                        signature: signature,
                        amount: 0,
                        address: NaN
                    }
                ]
            }
        };
    
        try {
            await this.blockchain.addTransaction(attendanceTransaction);
            console.log(`Attendance recorded for student ID: ${User_ID}, event ID: ${eventID} at timestamp: ${timestamp}`);
            
            return {
                message: "Attendance recorded successfully",
                transactionId: attendanceTransaction.id
            };
        } catch (error) {
            console.error("Failed to record attendance:", error.message);
            throw new Error("Failed to record attendance");
        }
    }
    
    async createSignedEvent(User_ID, eventID, privateKey, ddl) {
        console.log("Teachers array:", this.blockchain.teachers);
        const isTeacher = this.blockchain.teachers.some(teacher => teacher.id === User_ID);
        console.log(isTeacher);
        if (!isTeacher) {
            throw new Error(`User ${User_ID} is not a teacher and cannot create events.`);
        }
        const parsedDate = new Date(ddl);
        if (isNaN(parsedDate.getTime())) {
            throw new Error(`Invalid ddl format provided: ${ddl}`);
        }
        const timestamp = parsedDate.getTime();
        const messageHash = CryptoEdDSAUtil.hashMessage(`${eventID}_${timestamp}`);
        const signature = CryptoEdDSAUtil.signHash(privateKey, messageHash);
    
        const eventTransaction = {
            id: `event_${eventID}`,
            type: 'event',
            data: {
                inputs: [],
                outputs: [
                    {
                        User_ID: User_ID,
                        eventID: eventID,
                        timestamp: timestamp,
                        signature: signature,
                        amount: 0,
                        address: NaN
                    }
                ]
            }
        };
    
        await this.blockchain.addTransaction(eventTransaction);
        console.log(`Event created and signed by teacher ${User_ID} with ddl: ${ddl}`);
        return { transactionId: eventTransaction.id, timestamp };
    }
    
    
}

module.exports = Operator;