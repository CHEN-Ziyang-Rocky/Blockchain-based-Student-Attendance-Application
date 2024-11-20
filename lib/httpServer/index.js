// lib/httpServer/index.js
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const R = require('ramda');
const path = require('path');
const cors = require('cors');
const swaggerDocument = require('./swagger.json');
const Block = require('../blockchain/block');
const Transaction = require('../blockchain/transaction');
const TransactionAssertionError = require('../blockchain/transactionAssertionError');
const BlockAssertionError = require('../blockchain/blockAssertionError');
const HTTPError = require('./httpError');
const ArgumentError = require('../util/argumentError');
const CryptoUtil = require('../util/cryptoUtil');
const timeago = require('timeago.js');
const CryptoEdDSAUtil = require(path.resolve('lib/util/cryptoEdDSAUtil.js'));

class HttpServer {
    constructor(node, blockchain, operator, miner) {
        this.app = express();

        this.app.use(cors({
            origin: 'http://localhost:3000',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
            allowedHeaders: 'Content-Type, Authorization'
        }));

        const projectWallet = (wallet) => {
            return {
                id: wallet.id,
                addresses: R.map((keyPair) => {
                    return keyPair.publicKey;
                }, wallet.keyPairs)
            };
        };

        this.app.use(bodyParser.json());

        this.app.set('view engine', 'pug');
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.locals.formatters = {
            time: (rawTime) => {
                const timeInMS = new Date(rawTime * 1000);
                return `${timeInMS.toLocaleString()} - ${timeago().format(timeInMS)}`;
            },
            hash: (hashString) => {
                return hashString != '0' ? `${hashString.substr(0, 5)}...${hashString.substr(hashString.length - 5, 5)}` : '<empty>';
            },
            amount: (amount) => amount.toLocaleString()
        };
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        this.app.get('/blockchain', (req, res) => {
            if (req.headers['accept'] && req.headers['accept'].includes('text/html'))
                res.render('blockchain/index.pug', {
                    pageTitle: 'Blockchain',
                    blocks: blockchain.getAllBlocks()
                });
            else
                throw new HTTPError(400, 'Accept content not supported');
        });

        this.app.get('/blockchain/blocks', (req, res) => {
            res.status(200).send(blockchain.getAllBlocks());
        });

        this.app.get('/blockchain/blocks/latest', (req, res) => {
            let lastBlock = blockchain.getLastBlock();
            if (lastBlock == null) throw new HTTPError(404, 'Last block not found');

            res.status(200).send(lastBlock);
        });

        this.app.put('/blockchain/blocks/latest', (req, res) => {
            let requestBlock = Block.fromJson(req.body);
            let result = node.checkReceivedBlock(requestBlock);

            if (result == null) res.status(200).send('Requesting the blockchain to check.');
            else if (result) res.status(200).send(requestBlock);
            else throw new HTTPError(409, 'Blockchain is update.');
        });

        this.app.get('/blockchain/blocks/:hash([a-zA-Z0-9]{64})', (req, res) => {
            let blockFound = blockchain.getBlockByHash(req.params.hash);
            if (blockFound == null) throw new HTTPError(404, `Block not found with hash '${req.params.hash}'`);

            res.status(200).send(blockFound);
        });

        this.app.get('/blockchain/blocks/:index', (req, res) => {
            let blockFound = blockchain.getBlockByIndex(parseInt(req.params.index));
            if (blockFound == null) throw new HTTPError(404, `Block not found with index '${req.params.index}'`);

            res.status(200).send(blockFound);
        });

        this.app.get('/blockchain/blocks/transactions/:transactionId([a-zA-Z0-9]{64})', (req, res) => {
            let transactionFromBlock = blockchain.getTransactionFromBlocks(req.params.transactionId);
            if (transactionFromBlock == null) throw new HTTPError(404, `Transaction '${req.params.transactionId}' not found in any block`);

            res.status(200).send(transactionFromBlock);
        });

        this.app.get('/blockchain/transactions', (req, res) => {
            if (req.headers['accept'] && req.headers['accept'].includes('text/html'))
                res.render('blockchain/transactions/index.pug', {
                    pageTitle: 'Unconfirmed Transactions',
                    transactions: blockchain.getAllTransactions()
                });
            else
                res.status(200).send(blockchain.getAllTransactions());
        });

        this.app.post('/blockchain/transactions', (req, res) => {
            let requestTransaction = Transaction.fromJson(req.body);
            let transactionFound = blockchain.getTransactionById(requestTransaction.id);

            if (transactionFound != null) throw new HTTPError(409, `Transaction '${requestTransaction.id}' already exists`);

            try {
                let newTransaction = blockchain.addTransaction(requestTransaction);
                res.status(201).send(newTransaction);
            } catch (ex) {
                if (ex instanceof TransactionAssertionError) throw new HTTPError(400, ex.message, requestTransaction, ex);
                else throw ex;
            }
        });

        this.app.get('/blockchain/transactions/unspent', (req, res) => {
            res.status(200).send(blockchain.getUnspentTransactionsForAddress(req.query.address));
        });

        this.app.get('/operator/wallets', (req, res) => {
            let wallets = operator.getWallets();

            let projectedWallets = R.map(projectWallet, wallets);

            res.status(200).send(projectedWallets);
        });

        this.app.post('/operator/wallets', (req, res) => {
            let password = req.body.password;
            if (R.match(/\w+/g, password).length <= 4) throw new HTTPError(400, 'Password must contain more than 4 words');

            let newWallet = operator.createWalletFromPassword(password);

            let projectedWallet = projectWallet(newWallet);

            res.status(201).send(projectedWallet);
        });

        this.app.get('/operator/wallets/:walletId', (req, res) => {
            let walletFound = operator.getWalletById(req.params.walletId);
            if (walletFound == null) throw new HTTPError(404, `Wallet not found with id '${req.params.walletId}'`);

            let projectedWallet = projectWallet(walletFound);

            res.status(200).send(projectedWallet);
        });

        this.app.post('/operator/wallets/:walletId/transactions', (req, res) => {
            let walletId = req.params.walletId;
            let password = req.headers.password;

            if (password == null) throw new HTTPError(401, 'Wallet\'s password is missing.');
            let passwordHash = CryptoUtil.hash(password);

            try {
                if (!operator.checkWalletPassword(walletId, passwordHash)) throw new HTTPError(403, `Invalid password for wallet '${walletId}'`);

                let newTransaction = operator.createTransaction(walletId, req.body.fromAddress, req.body.toAddress, req.body.amount, req.body['changeAddress'] || req.body.fromAddress);

                newTransaction.check();

                let transactionCreated = blockchain.addTransaction(Transaction.fromJson(newTransaction));
                res.status(201).send(transactionCreated);
            } catch (ex) {
                if (ex instanceof ArgumentError || ex instanceof TransactionAssertionError) throw new HTTPError(400, ex.message, walletId, ex);
                else throw ex;
            }
        });

        this.app.get('/operator/wallets/:walletId/addresses', (req, res) => {
            let walletId = req.params.walletId;
            try {
                let addresses = operator.getAddressesForWallet(walletId);
                res.status(200).send(addresses);
            } catch (ex) {
                if (ex instanceof ArgumentError) throw new HTTPError(400, ex.message, walletId, ex);
                else throw ex;
            }
        });

        this.app.post('/operator/wallets/:walletId/addresses', (req, res) => {
            let walletId = req.params.walletId;
            let password = req.headers.password;

            if (password == null) throw new HTTPError(401, 'Wallet\'s password is missing.');
            let passwordHash = CryptoUtil.hash(password);

            try {
                if (!operator.checkWalletPassword(walletId, passwordHash)) throw new HTTPError(403, `Invalid password for wallet '${walletId}'`);

                let newAddress = operator.generateAddressForWallet(walletId);
                res.status(201).send({ address: newAddress });
            } catch (ex) {
                if (ex instanceof ArgumentError) throw new HTTPError(400, ex.message, walletId, ex);
                else throw ex;
            }
        });

        this.app.get('/operator/:addressId/balance', (req, res) => {
            let addressId = req.params.addressId;

            try {
                let balance = operator.getBalanceForAddress(addressId);
                res.status(200).send({ balance: balance });
            } catch (ex) {
                if (ex instanceof ArgumentError) throw new HTTPError(404, ex.message, { addressId }, ex);
                else throw ex;
            }
        });

        this.app.get('/node/peers', (req, res) => {
            res.status(200).send(node.peers);
        });

        this.app.post('/node/peers', (req, res) => {
            let newPeer = node.connectToPeer(req.body);
            res.status(201).send(newPeer);
        });

        this.app.get('/node/transactions/:transactionId([a-zA-Z0-9]{64})/confirmations', (req, res) => {
            node.getConfirmations(req.params.transactionId)
                .then((confirmations) => {
                    res.status(200).send({ confirmations: confirmations });
                });
        });

        this.app.post('/miner/mine', (req, res, next) => {
            miner.mine(req.body.rewardAddress, req.body['feeAddress'] || req.body.rewardAddress)
                .then((newBlock) => {
                    //console.log("Mining Result:", newBlock);
                    newBlock = Block.fromJson(newBlock);
                    blockchain.addBlock(newBlock);
                    res.status(201).send(newBlock);
                })
                .catch((ex) => {
                    if (ex instanceof BlockAssertionError && ex.message.includes('Invalid index')) next(new HTTPError(409, 'A new block were added before we were able to mine one'), null, ex);
                    else next(ex);
                });
        });

        this.app.use(function (err, req, res, next) {  // eslint-disable-line no-unused-vars
            if (err instanceof HTTPError) res.status(err.status);
            else res.status(500);
            res.send(err.message + (err.cause ? ' - ' + err.cause.message : ''));
        });

        this.app.post('/operator/registerStudent', async (req, res) => {
            console.log("Register Student Route Accessed");
            const { User_ID, password } = req.body;

            try {
                const result = await operator.User_register(User_ID, password);
                res.status(201).json(result);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });

        this.app.post('/operator/attendance', async (req, res) => {
            const { studentId, eventId, privateKey } = req.body;
            if (!studentId || !eventId || !privateKey) {
                return res.status(400).json({ message: "Missing required fields: studentId, eventId, or privateKey" });
            }

            try {
                const timestamp = Date.now();
                const message = `${studentId}${eventId}${timestamp}`;
                const messageHash = CryptoEdDSAUtil.hashMessage(message);

                const signature = CryptoEdDSAUtil.signHash(privateKey, messageHash);

                const attendanceData = {
                    studentId: studentId,
                    eventId: eventId,
                    timestamp: timestamp,
                    signature: signature,
                    messageHash: messageHash
                };

                const result = await operator.recordAttendance(studentId, eventId, timestamp, signature);

                return res.status(201).json({
                    message: result.message,
                    transactionId: result.transactionId,
                    attendanceData: attendanceData
                });
            } catch (error) {
                console.error("Failed to sign or record attendance:", error);
                return res.status(500).json({
                    message: "Failed to sign or record attendance",
                    error: error.message,
                });
            }
        });
        /*
        this.app.post('/operator/getSecretKey', (req, res) => {
            const { walletId, password } = req.body;

            if (!walletId || !password) {
                return res.status(400).json({ message: "Missing walletId or password" });
            }

            try {
                const passwordHash = CryptoUtil.hash(password); // Hash the password
                const wallet = operator.getWalletById(walletId);

                if (!wallet) {
                    return res.status(404).json({ message: "Wallet not found" });
                }

                if (wallet.passwordHash !== passwordHash) {
                    return res.status(403).json({ message: "Invalid password" });
                }

                // If valid, retrieve the secret key
                const secretKey = wallet.secret || wallet.generateSecret();
                //const secretKey = wallet.keyPair.secretKey || wallet.generateSecret();
                res.status(200).json({ secretKey });
            } catch (error) {
                console.error("Error retrieving secret key:", error.message);
                res.status(500).json({ message: "Internal server error", error: error.message });
            }
        });
        */
        this.app.post('/operator/getSecretKey', (req, res) => {
            const { walletId, password } = req.body;

            if (!walletId || !password) {
                return res.status(400).json({ message: "Missing walletId or password" });
            }

            try {
                const passwordHash = CryptoUtil.hash(password); // Hash the password
                const wallet = operator.getWalletById(walletId);

                if (!wallet) {
                    return res.status(404).json({ message: "Wallet not found" });
                }

                if (wallet.passwordHash !== passwordHash) {
                    return res.status(403).json({ message: "Invalid password" });
                }

                // Retrieve the first secretKey from the keyPairs array
                if (!wallet.keyPairs || wallet.keyPairs.length === 0) {
                    return res.status(404).json({ message: "No key pairs found in the wallet" });
                }

                const secretKey = wallet.keyPairs[0].secretKey; // Assume using the first key pair

                res.status(200).json({ secretKey });
            } catch (error) {
                console.error("Error retrieving secret key:", error.message);
                res.status(500).json({ message: "Internal server error", error: error.message });
            }
        });

        this.app.post('/operator/event', async (req, res) => {
            const { User_ID, eventId, ddl, privateKey } = req.body;

            if (!User_ID || !eventId || !ddl || !privateKey) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            try {
                const result = await operator.createSignedEvent(User_ID, eventId, privateKey, ddl);

                res.status(201).json({
                    message: "Event created successfully",
                    transactionId: result.transactionId,
                    timestamp: result.timestamp
                });
            } catch (error) {
                console.error("Failed to create event:", error);
                res.status(500).json({
                    message: "Failed to create event",
                    error: error.message
                });
            }
        });
    }

    listen(host, port) {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(port, host, (err) => {
                if (err) reject(err);
                console.info(`Listening http on port: ${this.server.address().port}, to access the API documentation go to http://${host}:${this.server.address().port}/api-docs/`);
                resolve(this);
            });
        });
    }

    stop() {
        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                if (err) reject(err);
                console.info('Closing http');
                resolve(this);
            });
        });
    }
}

module.exports = HttpServer;