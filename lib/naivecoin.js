const HttpServer = require('./httpServer');
const Blockchain = require('./blockchain');
const Operator = require('./operator');
const Miner = require('./miner');
const Node = require('./node');
const cors = require('cors'); // 引入 CORS 中间件

module.exports = function naivecoin(host, port, peers, logLevel, name) {
    host = process.env.HOST || host || 'localhost';
    port = process.env.PORT || process.env.HTTP_PORT || port || 3001;
    peers = (process.env.PEERS ? process.env.PEERS.split(',') : peers || []);
    peers = peers.map((peer) => { return { url: peer }; });
    logLevel = (process.env.LOG_LEVEL ? process.env.LOG_LEVEL : logLevel || 6);
    name = process.env.NAME || name || '1';

    require('./util/consoleWrapper.js')(name, logLevel);

    console.info(`Starting node ${name}`);

    let blockchain = new Blockchain(name);
    let operator = new Operator(name, blockchain);
    let miner = new Miner(blockchain, logLevel);
    let node = new Node(host, port, peers, blockchain);
    let httpServer = new HttpServer(node, blockchain, operator, miner);

    // 启用 CORS 中间件
    httpServer.app.use(cors()); // 允许所有来源的请求
    // 如果只允许特定来源，可以使用以下代码替代：
    // httpServer.app.use(cors({ origin: 'http://localhost:3000' }));

    httpServer.listen(host, port);
};
