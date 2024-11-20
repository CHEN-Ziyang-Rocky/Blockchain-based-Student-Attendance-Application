// /Users/chenziyang/Desktop/E-payment/Project/naivecoin/client/src/pages/home/Home.js
import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <h1 style={{ color: '#000' }}>Contributors:</h1>
            <table className="contributors-table">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Student ID</th>
                        <th>Responsible Part</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>CHEN Ziyang</td>
                        <td>21095751d</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>HE Rong</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>LI Shuhang</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>LU Zhoudao</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>LUO Yi</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>YE Chenwei</td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>

            <h2 style={{ color: '#000' }}>Project Procedures</h2>

            <div className="project-section">
                <h3 style={{ color: '#000' }}>Student information registration</h3>
                <ol>
                    <li>学生生成一个 key pair (public key & secret key)。public key = student identity（公钥）。</li>
                    <li>学生需要首先用自己的 student ID 和 public key 注册到区块链上。</li>
                    <li>然后保存 secret key 到 wallet 里。</li>
                </ol>
            </div>

            <div className="project-section">
                <h3 style={{ color: '#000' }}>Attendance information recording</h3>
                <ol>
                    <li>
                        学生使用他们的 secret key，签署 attendance certificate (student ID, event ID, and timestamp) 使用 ECDSA。
                        <ul>
                            <li>student ID = 学生号，eg. 21095751d</li>
                            <li>event ID = 老师自己生成的随机课程代码，eg. COMP4142</li>
                            <li>timestamp = 当下时间戳</li>
                        </ul>
                    </li>
                    <li>
                        签署 attendance certificate 后变成一个 transaction，transaction 首先发送到自己的节点的 pending pool 中，然后系统将会把这个 transaction 广播到其他和他配对的 node 的 pending pool 中。
                        <ul>
                            <li>Transaction = Attendance certificate + Signature</li>
                        </ul>
                    </li>
                </ol>
            </div>

            <div className="project-section">
                <h3 style={{ color: '#000' }}>Mint</h3>
                <ol>
                    <li>其他 node 收到 Transaction 后，使用 public key 验证其 Transaction 里 attendance certificate 的 signature，验证成功放入 pending pool 中。</li>
                    <li>学生可以将 pending pool 中的 transaction 按照优先级选择一些 transaction 进行打包。</li>
                    <li>矿工 = 学生。在自己的节点打包 transaction 后开始挖矿，成功满足 PoW 生成区块哈希值，获得生成新区块的权利，已打包 transaction 就会从 pending pool 中移除并添加到区块链中。</li>
                    <li>其成功添加区块的 node 将新区块广播给网络中的其他 node，其他 node 验证该区块并将其添加到本地的区块链副本中，并且删除自己 pending pool 中的对应 transaction。</li>
                </ol>
            </div>

            <div className="project-section">
                <h3 style={{ color: '#000' }}>Record querying</h3>
                <p>教师可以查询特定学生的整个学期或几个星期出勤情况，或一个班级的出勤名单。</p>
            </div>
        </div>
    );
};

export default Home;
