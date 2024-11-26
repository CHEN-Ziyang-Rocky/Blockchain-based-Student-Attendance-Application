const EventEmitter = require('events');
const R = require('ramda');
const Db = require('../util/db');
const Blocks = require('./blocks');
const Block = require('./block');
const Transactions = require('./transactions');
const Teacher = require('./teacher');
const Teachers = require('./teachers');
const TransactionAssertionError = require('./transactionAssertionError');
const BlockAssertionError = require('./blockAssertionError');
const BlockchainAssertionError = require('./blockchainAssertionError');
const Config = require('../config');

// Database settings
const BLOCKCHAIN_FILE = 'blocks.json';
const TRANSACTIONS_FILE = 'transactions.json';
const TEACHERS_FILE = 'teachers.json'
class Blockchain {
    constructor(dbName) {
        this.blocksDb = new Db('data/' + dbName + '/' + BLOCKCHAIN_FILE, new Blocks());
        this.transactionsDb = new Db('data/' + dbName + '/' + TRANSACTIONS_FILE, new Transactions());
        this.teachersDb = new Db('data/' + dbName + '/' + TEACHERS_FILE, new Teachers());
        // INFO: In this implementation the database is a file and every time data is saved it rewrites the file, probably it should be a more robust database for performance reasons
        this.blocks = this.blocksDb.read(Blocks);
        this.transactions = this.transactionsDb.read(Transactions);
        this.teachers = this.teachersDb.read(Teachers);

        // Some places uses the emitter to act after some data is changed
        this.emitter = new EventEmitter();
        this.init();
    }

    init() {
        // Create the genesis block if the blockchain is empty
        if (this.blocks.length == 0) {
            console.info('Blockchain empty, adding genesis block');
            this.blocks.push(Block.genesis);
            this.blocksDb.write(this.blocks);
        }
        if (this.teachers.length == 0){
            const teacher1 = new Teacher('12345678t'); 
            this.addTeacher(teacher1);
            const teacher2 = new Teacher('Koriss'); 
            this.addTeacher(teacher2);
            const teacher = new Teacher('XiaoBin'); 
            this.addTeacher(teacher);
        }
        

        // Remove transactions that are in the blockchain
        console.info('Removing transactions that are in the blockchain');
        R.forEach(this.removeBlockTransactionsFromTransactions.bind(this), this.blocks);
    }

    getAllBlocks() {
        return this.blocks;
    }

    getBlockByIndex(index) {
        return R.find(R.propEq('index', index), this.blocks);
    }

    getBlockByHash(hash) {
        return R.find(R.propEq('hash', hash), this.blocks);
    }

    getLastBlock() {
        return R.last(this.blocks);
    }

    getDifficulty(index) {        
        // Calculates the difficulty based on the index since the difficulty value increases every X blocks.
        return Config.pow.getDifficulty(this.blocks, index);        
    }

    getAllTransactions() {
        return this.transactions;
    }

    getTransactionById(id) {
        return R.find(R.propEq('id', id), this.transactions);
    }

    getTransactionFromBlocks(transactionId) {
        return R.find(R.compose(R.find(R.propEq('id', transactionId)), R.prop('transactions')), this.blocks);
    }

    async replaceChain(newBlockchain) {
        // It doesn't make sense to replace this blockchain by a smaller one
        // if (newBlockchain.length <= this.blocks.length) {
        //     console.error('Blockchain shorter than the current blockchain');
        //     throw new BlockchainAssertionError('Blockchain shorter than the current blockchain');
        // }
         // Calculate cumulative difficulties
         const currentCumulativeDifficulty = this.calculateCumulativeDifficulty(this.blocks);
         const newCumulativeDifficulty = this.calculateCumulativeDifficulty(newBlockchain);

         // Compare cumulative difficulties
         if (newCumulativeDifficulty > currentCumulativeDifficulty) {
             console.info('Replacing current blockchain with received blockchain due to higher cumulative difficulty');
             let newBlocks = R.takeLast(newBlockchain.length - this.blocks.length, newBlockchain);

             R.forEach((block) => {
                 this.addBlock(block, false);
             }, newBlocks);

             this.emitter.emit('blockchainReplaced', newBlocks);
         } else {
             console.warn('Received chain has lower cumulative difficulty. Ignoring it.');
         }

        // Verify if the new blockchain is correct
        await this.checkChain(newBlockchain);
    }

    async replaceChainBasedOnLong(newBlockchain) {
//        It doesn't make sense to replace this blockchain by a smaller one
         if (newBlockchain.length <= this.blocks.length) {
             console.error('Blockchain shorter than the current blockchain');
             throw new BlockchainAssertionError('Blockchain shorter than the current blockchain');
         }

        // Verify if the new blockchain is correct
        await this.checkChain(newBlockchain);
    }

    async checkChain(blockchainToValidate) {
        // Check if the genesis block is the same
        if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(Block.genesis)) {
            console.error('Genesis blocks aren\'t the same');
            throw new BlockchainAssertionError('Genesis blocks aren\'t the same');
        }

        // Compare every block to the previous one (it skips the first one, because it was verified before)
        try {
            for (let i = 1; i < blockchainToValidate.length; i++) {
                await this.checkBlock(blockchainToValidate[i], blockchainToValidate[i - 1], blockchainToValidate);
            }
        } catch (ex) {
            console.error('Invalid block sequence');
            throw new BlockchainAssertionError('Invalid block sequence', null, ex);
        }
        return true;
    }

    async addBlock(newBlock, emit = true) {
        // It only adds the block if it's valid (we need to compare to the previous one)
        if (await this.checkBlock(newBlock, this.getLastBlock())) {
            this.blocks.push(newBlock);
            this.blocksDb.write(this.blocks);

            // After adding the block it removes the transactions of this block from the list of pending transactions
            this.removeBlockTransactionsFromTransactions(newBlock);

            //console.info(`Block added: ${newBlock.hash}`);
            //console.debug(`Block added: ${JSON.stringify(newBlock)}`);
            if (emit) this.emitter.emit('blockAdded', newBlock);

            return newBlock;
        }
    }

    async addTransaction(newTransaction, emit = true) {
        if (await this.checkTransaction(newTransaction, this.blocks)) {
            this.transactions.push(newTransaction);
            this.transactionsDb.write(this.transactions);
    
            console.info(`Transaction added: ${newTransaction.id}`);
            if (emit) this.emitter.emit('transactionAdded', newTransaction);
    
            return newTransaction;
        }
    }

    async addTeacher(teacher) {
        this.teachers.push(teacher);
        this.teachersDb.write(this.teachers);
        console.info(`Teacher added: ${JSON.stringify(teacher)}`);

        return teacher;
    }
    
    

    // async removeBlockTransactionsFromTransactions(newBlock) {
    //     console.log("Transactions before removal:", this.transactions);
    //     console.log("Block transactions:", newBlock.transactions);
    //     this.transactions = R.reject((transaction) => { return R.find(R.propEq('id', transaction.id), newBlock.transactions); }, this.transactions);
    //     this.transactionsDb.write(this.transactions);
    // }
    async removeBlockTransactionsFromTransactions(newBlock) {
        //console.log("Transactions before removal:", this.transactions);
        //console.log("Block transactions:", newBlock.transactions);
    
        const blockTransactionIds = new Set(newBlock.transactions.map(tx => tx.id));
    
        this.transactions = this.transactions.filter(transaction => {
            const found = blockTransactionIds.has(transaction.id);
            if (found) {
                console.log(`Removing transaction with ID: ${transaction.id}`);
            }
            return !found;
        });
    
        //console.log("Transactions after removal:", this.transactions);
        this.transactionsDb.write(this.transactions);
    }
    
    async checkBlock(newBlock, previousBlock, referenceBlockchain = this.blocks) {
        const blockHash = newBlock.toHash();

        if (previousBlock.index + 1 !== newBlock.index) { // Check if the block is the last one
            console.error(`Invalid index: expected '${previousBlock.index + 1}' got '${newBlock.index}'`);
            throw new BlockAssertionError(`Invalid index: expected '${previousBlock.index + 1}' got '${newBlock.index}'`);
        } else if (previousBlock.hash !== newBlock.previousHash) { // Check if the previous block is correct
            console.error(`Invalid previoushash: expected '${previousBlock.hash}' got '${newBlock.previousHash}'`);
            throw new BlockAssertionError(`Invalid previoushash: expected '${previousBlock.hash}' got '${newBlock.previousHash}'`);
        } else if (blockHash !== newBlock.hash) { // Check if the hash is correct
            console.error(`Invalid hash: expected '${blockHash}' got '${newBlock.hash}'`);
            throw new BlockAssertionError(`Invalid hash: expected '${blockHash}' got '${newBlock.hash}'`);
        } else if (newBlock.getDifficulty() >= this.getDifficulty(newBlock.index)) { // If the difficulty level of the proof-of-work challenge is correct
            console.error(`Invalid proof-of-work difficulty: expected '${newBlock.getDifficulty()}' to be smaller than '${this.getDifficulty(newBlock.index)}'`);
            throw new BlockAssertionError(`Invalid proof-of-work difficulty: expected '${newBlock.getDifficulty()}' be smaller than '${this.getDifficulty()}'`);
        }

        // INFO: Here it would need to check if the block follows some expectation regarging the minimal number of transactions, value or data size to avoid empty blocks being mined.

        // For each transaction in this block, check if it is valid
        R.forEach(await this.checkTransaction.bind(this), newBlock.transactions, referenceBlockchain);

        // Check if the sum of output transactions are equal the sum of input transactions + MINING_REWARD (representing the reward for the block miner)
        //let sumOfInputsAmount = R.sum(R.flatten(R.map(R.compose(R.map(R.prop('amount')), R.prop('inputs'), R.prop('data')), newBlock.transactions))) + Config.MINING_REWARD;
        //let sumOfOutputsAmount = R.sum(R.flatten(R.map(R.compose(R.map(R.prop('amount')), R.prop('outputs'), R.prop('data')), newBlock.transactions)));
        let inputsAmounts = R.flatten(R.map(R.compose(R.map(R.prop('amount')), R.prop('inputs'), R.prop('data')), newBlock.transactions));
        let outputsAmounts = R.flatten(R.map(R.compose(R.map(R.prop('amount')), R.prop('outputs'), R.prop('data')), newBlock.transactions));

        inputsAmounts = inputsAmounts.filter(amount => typeof amount === 'number');
        outputsAmounts = outputsAmounts.filter(amount => typeof amount === 'number');
        let sumOfInputsAmount = R.sum(inputsAmounts) + Config.MINING_REWARD;
        let sumOfOutputsAmount = R.sum(outputsAmounts);

        let isInputsAmountGreaterOrEqualThanOutputsAmount = R.gte(sumOfInputsAmount, sumOfOutputsAmount);

        if (!isInputsAmountGreaterOrEqualThanOutputsAmount) {
            console.error(`Invalid block balance: inputs sum '${sumOfInputsAmount}', outputs sum '${sumOfOutputsAmount}'`);
            throw new BlockAssertionError(`Invalid block balance: inputs sum '${sumOfInputsAmount}', outputs sum '${sumOfOutputsAmount}'`, { sumOfInputsAmount, sumOfOutputsAmount });
        }

        // Check if there is double spending
        let listOfTransactionIndexInputs = R.flatten(R.map(R.compose(R.map(R.compose(R.join('|'), R.props(['transaction', 'index']))), R.prop('inputs'), R.prop('data')), newBlock.transactions));
        let doubleSpendingList = R.filter((x) => x >= 2, R.map(R.length, R.groupBy(x => x)(listOfTransactionIndexInputs)));

        if (R.keys(doubleSpendingList).length) {
            console.error(`There are unspent output transactions being used more than once: unspent output transaction: '${R.keys(doubleSpendingList).join(', ')}'`);
            throw new BlockAssertionError(`There are unspent output transactions being used more than once: unspent output transaction: '${R.keys(doubleSpendingList).join(', ')}'`);
        }

        // Check if there is only 1 fee transaction and 1 reward transaction;
        let transactionsByType = R.countBy(R.prop('type'), newBlock.transactions);
        if (transactionsByType.fee && transactionsByType.fee > 1) {
            console.error(`Invalid fee transaction count: expected '1' got '${transactionsByType.fee}'`);
            throw new BlockAssertionError(`Invalid fee transaction count: expected '1' got '${transactionsByType.fee}'`);
        }

        if (transactionsByType.reward && transactionsByType.reward > 1) {
            console.error(`Invalid reward transaction count: expected '1' got '${transactionsByType.reward}'`);
            throw new BlockAssertionError(`Invalid reward transaction count: expected '1' got '${transactionsByType.reward}'`);
        }

        return true;
    }

    async checkTransaction(transaction, referenceBlockchain = this.blocks) {
       
        // Check the transaction
        if (!transaction) return;
        transaction.data = transaction.data || { inputs: [], outputs: [] };
        transaction.data.inputs = transaction.data.inputs || [];
        transaction.data.outputs = transaction.data.outputs || [];
        console.log("checking transaction:", transaction);

        // Verify if the transaction isn't already in the blockchain
        let isNotInBlockchain = R.all((block) => {
            return R.none(R.propEq('id', transaction.id), block.transactions);
        }, referenceBlockchain);
        if (!isNotInBlockchain) {
            console.error(`Transaction '${transaction.id}' is already in the blockchain`);
            throw new TransactionAssertionError(`Transaction '${transaction.id}' is already in the blockchain`, transaction);
        }
        //console.log("isNotInBlockchain:", isNotInBlockchain);
        // Verify if all input transactions are unspent in the blockchain
        // let isInputTransactionsUnspent = R.all(R.equals(false), R.flatten(R.map((txInput) => {
        //     return R.map(
        //         R.pipe(
        //             R.prop('transactions'),
        //             R.map(R.pipe(
        //                 R.path(['data', 'inputs']),
        //                 R.contains({ transaction: txInput.transaction, index: txInput.index })
        //             ))
        //         ), referenceBlockchain);
        // }, transaction.data.inputs)));
        let isInputTransactionsUnspent = R.all(R.equals(false), R.flatten(R.map((txInput) => {
            return R.map(
                R.pipe(
                    R.prop('transactions'),
                    R.map(R.pipe(
                        R.path(['data', 'inputs']),
                        R.any(R.equals({ transaction: txInput.transaction, index: txInput.index })) 
                    ))
                ), referenceBlockchain);
        }, transaction.data.inputs)));
        
        if (!isInputTransactionsUnspent) {
            console.error(`Not all inputs are unspent for transaction '${transaction.id}'`);
            throw new TransactionAssertionError(`Not all inputs are unspent for transaction '${transaction.id}'`, transaction.data.inputs);
        }
        return true;
    }

    getUnspentTransactionsForAddress(address) {
        const selectTxs = (transaction) => {
            let index = 0;
            // Create a list of all transactions outputs found for an address (or all).
            R.forEach((txOutput) => {
                if (address && txOutput.address == address) {
                    txOutputs.push({
                        transaction: transaction.id,
                        index: index,
                        amount: txOutput.amount,
                        address: txOutput.address
                    });
                }
                index++;
            }, transaction.data.outputs);

            // Create a list of all transactions inputs found for an address (or all).            
            R.forEach((txInput) => {
                if (address && txInput.address != address) return;

                txInputs.push({
                    transaction: txInput.transaction,
                    index: txInput.index,
                    amount: txInput.amount,
                    address: txInput.address
                });
            }, transaction.data.inputs);
        };

        // Considers both transactions in block and unconfirmed transactions (enabling transaction chain)
        let txOutputs = [];
        let txInputs = [];
        R.forEach(R.pipe(R.prop('transactions'), R.forEach(selectTxs)), this.blocks);
        R.forEach(selectTxs, this.transactions);

        // Cross both lists and find transactions outputs without a corresponding transaction input
        let unspentTransactionOutput = [];
        R.forEach((txOutput) => {
            if (!R.any((txInput) => txInput.transaction == txOutput.transaction && txInput.index == txOutput.index, txInputs)) {
                unspentTransactionOutput.push(txOutput);
            }
        }, txOutputs);

        return unspentTransactionOutput;
    }

    getAttendanceTransactions({ User_ID, eventID, startTime, endTime }) {
        const transactionsInBlocks = R.flatten(R.map(R.prop('transactions'), this.getAllBlocks()));    
        const parsedStartTime = startTime ? new Date(startTime).getTime() : null;
        const parsedEndTime = endTime ? new Date(endTime).getTime() : null;
    
        return transactionsInBlocks.filter(tx => {
            if (tx.type !== 'attendance') return false;
    
            const isStudentMatch = !User_ID || R.propEq('User_ID', User_ID, tx.data);
            const isEventMatch = !eventID || R.propEq('eventID', eventID, tx.data);
            const isTimeMatch = (!parsedStartTime || tx.data.timestamp >= parsedStartTime) &&
                                (!parsedEndTime || tx.data.timestamp <= parsedEndTime);
    
            return isStudentMatch && isEventMatch && isTimeMatch;
        });
    }

    getAllEvents() {
        console.log('getAllEvents called');
        const transactionsInBlocks = R.flatten(R.map(R.prop('transactions'), this.getAllBlocks()));    
        const events = transactionsInBlocks
            .filter(tx => tx.type === 'event') 
            .map(tx => tx.data.outputs[0]) 
            .map(output => ({
                eventID: output.eventID
            })); 
        console.log('All events:', events);
        return events;
    }      
}

module.exports = Blockchain;
