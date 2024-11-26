# COMP4142 Group Project based on Naivecoin

## Contributors:

| Student Name | Student ID | Responsible Part                                             |
| ------------ | ---------- | ------------------------------------------------------------ |
| CHEN Ziyang  | 21095751d  | All frontend content of the Student Attendance Application, <br />and create a user-friendly UI. Create the function "Get Secret Key" <br />on the backend. Assist the backend to complete the work. |
| HE Rong      | 21101622d  | Attend group meetings with team members to discuss the project. |
| LI Shuhang   | 21102658d  | Implementation the backend of the Student Attendance Application: <br />Student information registration and Mint. <br />Assist the frontend to complete the corresponding work. |
| LU Zhoudao   | 21099695d  | Enhanced functionality: Achieve dynamic difficulty and Basic Fork Resolution (cumulative difficulty).|
| LUO Yi       | 21108269d  | Enhanced functionality: Basic Fork Resolution.                |
| YE Chenwei   | 21103853d  | Implementation the backend of the Student Attendance Application: <br />Attendance information recording and Record querying. <br />Assist the frontend to complete the corresponding work. |



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

  

## Project Functions:

### Student Information Registration

1. Students generate a key pair (public key & secret key), where the public key serves as the student's identity.
2. Students must first register their **student ID** and **public key** on the blockchain.
3. They then save the secret key to their wallet.

### Attendance Information Recording

1. Students use their secret key to sign an 

   attendance certificate

    (consisting of student ID, event ID, and timestamp) using ECDSA.

   - **Student ID**: The student's unique identifier, e.g., `21095751d`.
   - **Event ID**: A randomly generated course code created by the teacher, e.g., `COMP4142`.
   - **Timestamp**: The current timestamp.

2. After signing the attendance certificate, it becomes a transaction. The transaction is first sent to the pending pool of the student's node and then broadcasted to the pending pools of other paired nodes.

   - **Transaction = Attendance Certificate + Signature**

### Mint

1. When other nodes receive the transaction, they use the **public key** to verify the **signature** in the attendance certificate. If verified, the transaction is added to their pending pool.
2. Students can select transactions from the pending pool based on priority and package them.
3. **Miner = Student**: After packaging transactions in their node, students start mining. Upon successfully solving the PoW and generating the block hash, they gain the right to add a new block. Packaged transactions are then removed from the pending pool and added to the blockchain.
4. The node that successfully adds the block broadcasts the new block to other nodes in the network. Other nodes validate the block, add it to their local blockchain copy, and remove the corresponding transactions from their pending pool.

### Record Querying

Teachers (`12345678t`, `Korris`, and `XiaoBin`) can query the attendance records for an entire semester or specific weeks of a particular student, or retrieve the attendance list for an entire class. (So far, our database only has three teacher, and the teacher id is `12345678t`, `Korris`, and `XiaoBin`)
