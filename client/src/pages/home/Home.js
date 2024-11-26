import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <h1 style={{ textAlign: 'center', color: '#000' }}>COMP4142 Group Project based on Naivecoin</h1>

            <h2 style={{ color: '#000' }}>Contributors:</h2>
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
                        <td><strong>CHEN Ziyang</strong></td>
                        <td><strong>21095751d</strong></td>
                        <td>
                            <strong>All frontend content</strong> of the <strong>Student Attendance Application</strong>, <br />
                            and create a <strong>user-friendly UI</strong>. Create the function <strong>"Get Secret Key"</strong> <br />
                            on the backend. Assist the backend to complete the work.
                        </td>
                    </tr>
                    <tr>
                        <td><strong>HE Rong</strong></td>
                        <td><strong>21101622d</strong></td>
                        <td>Assist in enhancing functionality and organizing meetings. <br />Overall flow check.</td>
                    </tr>
                    <tr>
                        <td><strong>LI Shuhang</strong></td>
                        <td><strong>21102658d</strong></td>
                        <td>
                            Implementation the backend of the <strong>Student Attendance Application</strong>: <br />
                            <strong>Student information registration</strong> and <strong>Mint</strong>. <br />
                            Assist the frontend to complete the corresponding work.
                        </td>
                    </tr>
                    <tr>
                        <td><strong>LU Zhoudao</strong></td>
                        <td><strong>21099695d</strong></td>
                        <td>Enhanced functionality: <strong>Achieve dynamic difficulty and <br /> Basic Fork Resolution (cumulative difficulty).</strong></td>
                    </tr>
                    <tr>
                        <td><strong>LUO Yi</strong></td>
                        <td><strong>21108269d</strong></td>
                        <td>Enhanced functionality: <strong>Basic Fork Resolution.</strong></td>
                    </tr>
                    <tr>
                        <td><strong>YE Chenwei</strong></td>
                        <td><strong>21103853d</strong></td>
                        <td>
                            Implementation the backend of the <strong>Student Attendance Application</strong>: <br />
                            <strong>Attendance information recording</strong> and <strong>Record querying</strong>. <br />
                            Assist the frontend to complete the corresponding work.
                        </td>
                    </tr>
                </tbody>
            </table>

            <h2 style={{ color: '#000' }}>Project Functions:</h2>

            <div className="project-section">
                <h3 style={{ color: '#000' }}>Student Information Registration</h3>
                <ol>
                    <li>Students generate a key pair (public key & secret key), where the public key serves as the student's identity.</li>
                    <li>Students must first register their <strong>student ID</strong> and <strong>public key</strong> on the blockchain.</li>
                    <li>They then save the secret key to their wallet.</li>
                </ol>
            </div>

            <div className="project-section">
                <h3 style={{ color: '#000' }}>Attendance Information Recording</h3>
                <ol>
                    <li>
                        Students use their secret key to sign an <strong>attendance certificate</strong> (consisting of student ID, event ID, and timestamp) using ECDSA.
                        <ul>
                            <li><strong>Student ID:</strong> The student's unique identifier, e.g., <code>21095751d</code>.</li>
                            <li><strong>Event ID:</strong> A randomly generated course code created by the teacher, e.g., <code>COMP4142</code>.</li>
                            <li><strong>Timestamp:</strong> The current timestamp.</li>
                        </ul>
                    </li>
                    <li>
                        After signing the attendance certificate, it becomes a transaction. The transaction is first sent to the pending pool of the student's node and then broadcasted to the pending pools of other paired nodes.
                        <ul>
                            <li><strong>Transaction:</strong> Attendance Certificate + Signature</li>
                        </ul>
                    </li>
                </ol>
            </div>

            <div className="project-section">
                <h3 style={{ color: '#000' }}>Mint</h3>
                <ol>
                    <li>When other nodes receive the transaction, they use the <strong>public key</strong> to verify the <strong>signature</strong> in the attendance certificate. If verified, the transaction is added to their pending pool.</li>
                    <li>Students can select transactions from the pending pool based on priority and package them.</li>
                    <li>
                        <strong>Miner = Student:</strong> After packaging transactions in their node, students start mining. Upon successfully solving the PoW and generating the block hash, they gain the right to add a new block. Packaged transactions are then removed from the pending pool and added to the blockchain.
                    </li>
                    <li>The node that successfully adds the block broadcasts the new block to other nodes in the network. Other nodes validate the block, add it to their local blockchain copy, and remove the corresponding transactions from their pending pool.</li>
                </ol>
            </div>

            <div className="project-section">
                <h3 style={{ color: '#000' }}>Record Querying</h3>
                <p>Teachers, e.g., <code>12345678t, Korris, and XiaoBin</code> can query the attendance records for an entire semester or specific weeks of a particular student, or retrieve the attendance list for an entire class. (So far, our database only has three teacher, and the teacher id is <code>12345678t, Korris, and XiaoBin</code>)</p>
            </div>
        </div>
    );
};

export default Home;
