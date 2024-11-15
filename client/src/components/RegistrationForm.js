// src/components/RegistrationForm.js

import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css'; // 引入 CSS 文件

const RegistrationForm = () => {
    const [studentID, setStudentID] = useState('');
    const [password, setPassword] = useState('');
    const [registrationResult, setRegistrationResult] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setRegistrationResult(null);

        try {
            // 替换为你的后端API地址
            const response = await axios.post('http://localhost:3001/operator/registerStudent', {
                studentID,
                password,
            });

            setRegistrationResult(response.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || '注册失败，请稍后再试。');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container">
            <h2>用户注册</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="studentID">学生ID:</label>
                    <input
                        type="text"
                        id="studentID"
                        value={studentID}
                        onChange={(e) => setStudentID(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">密码:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '注册中...' : '注册'}
                </button>
            </form>

            {error && <div className="error">{error}</div>}

            {registrationResult && (
                <div className="result">
                    <h3>注册成功！</h3>
                    <p><strong>学生ID:</strong> {registrationResult.studentID}</p>
                    <p><strong>钱包ID:</strong> {registrationResult.walletID}</p>
                    <p><strong>公钥:</strong> {registrationResult.publicKey}</p>
                </div>
            )}
        </div>
    );
};

export default RegistrationForm;
