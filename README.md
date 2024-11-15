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



问题：

1. 第一个人注册之后需要自己的 student ID 和 public key 放到区块链上，是谁来确认这个transaction，是不是第一个人就需要自己将其打包，放到区块链上。
2. 老师是不是和学生一样需要注册，如果需要的话，是否要在区块链上用自己的 event id 和 public key 注册到区块链上。
3. 老师生成的event id，可不可以看成是课程的代码（只是这个是随机的数）
4. 一个老师可不可以生成多个event id