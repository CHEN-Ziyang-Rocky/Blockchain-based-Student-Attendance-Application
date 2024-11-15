# COMP4142 Group Project based on Naivecoin

## Contributors:

| Student Name | Student ID | Responsible Part |
| ------------ | ---------- | ---------------- |
| CHEN Ziyang  | 21095751d  |                  |
| HE Rong      |            |                  |
| LI Shuhang   |            |                  |
| LU Zhoudao   |            |                  |
| LUO Yi       |            |                  |
| YE Chenwei   |            |                  |



## Start Our Project:

- Run a node:

  ```sh
  node bin/naivecoin.js -p 3001 --name 1
  ```

- Run the second node and add peers:

  ```sh
  node bin/naivecoin.js -p 3002 --name 2 --peers http://localhost:3001
  ```

- Access the swagger API:

  ```shell
  http://localhost:3001/api-docs/
  ```


### Docker

```sh
# Build the image
$ docker build . -t naivecoin

# Run naivecoin in a docker
$ ./dockerExec.sh

# Run naivecoin in a docker using port 3002
$ ./dockerExec.sh -p 3002

# Run naivecoin in a docker options
$ ./dockerExec.sh -h
Usage: ./dockerExec.sh -a HOST -p PORT -l LOG_LEVEL -e PEERS -n NAME

# Run docker-compose with 3 nodes
$ docker-compose up
```

### Client

```sh
# Command-line options
$ node bin/naivecoin.js -h
Usage: bin\naivecoin.js [options]

Options:
  -a, --host       Host address. (localhost by default)
  -p, --port       HTTP port. (3001 by default)
  -l, --log-level  Log level (7=dir, debug, time and trace, 6=log and info,
                   4=warn, 3=error, assert, 6 by default).
  --peers          Peers list.                                           [array]
  --name           Node name/identifier.
  -h, --help       Show help                                           [boolean]
```

### Development

```sh
# Cloning repository
$ git clone git@github.com:conradoqg/naivecoin.git
$ cd naivecoin
$ npm install

# Testing
$ npm test
```



## 项目流程：

### Student information registration

1. 学生生成一个key pair (public key & secret key) public key = student identity（公钥）
2. 学生需要首先用自己的 student ID 和 public key 注册到区块链上
3. 然后保存 secret key 到 wallet 里

### Attendance information recording

1. 学生使用他们的 secret key，签署 attendance certificate (student ID, event ID, and timestamp) 使用 ECDSA。
   - student ID = 学生号，eg. 21095751d
   - event ID = 老师自己生成的随机课程代码，eg. COMP4142
   - timestamp = 当下时间戳
2. 签署 attendance certificate 后变成一个 transaction，transaction 首先发送到自己的节点的 pending pool 中，然后系统将会把这个 transaction 广播到其他和他配对的 node 的 pending pool 中。
   - Transaction = Attendance certificate + Signature

### Mint

1. 其他 node 收到 Transaction 后，使用 public key 验证其 Transaction 里 attendance certificate 的 signature，验证成功放入 pending pool 中。
2. 学生可以将 pending pool 中的 transaction 按照优先级选择一些 transaction 进行打包。
3. 矿工 = 学生 在自己的节点打包 transaction 后开始挖矿，成功满足PoW生成区块哈希值，获得生成新区块的权利，已打包 transaction 就会从 pending pool 中移除并添加到区块链中。
4. 其成功添加区块的 node 将新区块广播给网络中的其他 node，其他 node 验证该区块并将其添加到本地的区块链副本中，并且删除自己 pending pool 中的对应 transaction。

### Record querying

教师可以查询特定学生的整个学期或几个星期出勤情况，或一个班级的出勤名单。





## Start Our Project:

npx create-react-app client



npm install react-router-dom

npm install @ant-design/icons

npm install antd react-redux

npm install @reduxjs/toolkit

- Run a node:

  ```sh
  node bin/naivecoin.js -p 3001 --name 1
  ```

- Run the second node and add peers:

  ```sh
  node bin/naivecoin.js -p 3002 --name 2 --peers http://localhost:3001
  ```

- Run the Client:

  ```
  cd client
  npm start
  ```

  