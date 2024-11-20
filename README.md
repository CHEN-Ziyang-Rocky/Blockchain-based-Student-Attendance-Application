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

- Run the Client:

  ```
  cd client
  npm start
  ```

- Access the swagger API:

  ```
  http://localhost:3001/api-docs/
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



[{"id":"0516376655b5d2a0999eec02b6475e728337f2c3d1ca5571d6df0e37d4d42b96","passwordHash":"8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92","secret":"0bdc7ff7e4f71ce377e3217feda8b74ae520488342d860e2a27cb6e50fc168458d0be7958e8327bb0d1ef763e2627a175846045daf97b7ca2a991a16e8dab443d8ad05ccefd5114d7c7315fb8645d02d7d248b1585dfd16e51d47f42d2df4581881e87d8d02cb50e455d3051df925377381fb4b4bb5ea5e2c9f6403c69a2d470ff9f42c015a52e549da2e6cf959c958941279345c3b973541fc5591e45a25fd2b631ff87e26152e2a7860dd563d0b618e4bb9cfd879d6521d79bcb4b401fb56b01d913a620240bdebe88c74b1614c641512e06aaf3d7b3072f1c1a075ed3b86631393b8d9f39d09a73f853516a9ad49b16baead50d16a4213d93cdeb77638ea906d643043517f2e17fe9371ccc8ec64fec02525f3eb3eeefd3e70e5d2c2d83758764e1c05c7ea7e8d18abb070139eddbc395f6d6afbcf4e125b31bbec3bdbbd70d2249d1532bfb8a743da84f0afa3079f909980eef27cbc527415f38b14c6cdb7c5238e2fa0e2a41251e6a0f07b136f1f3d2cd51b4aba8d156ad41e7f27e3898bbcc0eeac103fd5ec1c2dee4a9b3c4596de78aebd070bbdfa9ec7a3fabaf58d3ee579e244145998dcf83dab0116d1f7415578c778b189cd1e771148971ce350fe49fb81b178ee38e1a0bde53118082d67759d1ba6ddf9ff562ca6fa1e3c8515a2a141b9c7a4951dd738fb8314aa9ca4baf0af4418545beb440c65e48278c7019","keyPairs":[{"index":1,"secretKey":"0bdc7ff7e4f71ce377e3217feda8b74ae520488342d860e2a27cb6e50fc16845","publicKey":"63211c577af2f6bb910206fdf4f4aad801eed311c0d53cce9e560fa32ff1fdec"}]}]
