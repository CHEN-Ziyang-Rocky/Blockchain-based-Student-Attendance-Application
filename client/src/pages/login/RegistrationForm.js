// src/pages/login/RegistrationForm.js

import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Alert, Typography } from 'antd';
import './RegistrationForm.css';

const { Title } = Typography;

const RegistrationForm = () => {
    const [registrationResult, setRegistrationResult] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onFinish = async (values) => {
        setIsSubmitting(true);
        setError(null);
        setRegistrationResult(null);

        try {
            const response = await axios.post('http://localhost:3001/operator/registerStudent', values);
            setRegistrationResult(response.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed, please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container">
            <Title level={2} style={{ textAlign: 'center', color: '#000' }}>
                Registration
            </Title>
            <Form onFinish={onFinish} className="form">
                <Form.Item
                    label="User ID"
                    name="User_ID"
                    rules={[{ required: true, message: 'Please enter your ID' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={isSubmitting}>
                        Register
                    </Button>
                </Form.Item>
            </Form>

            {error && (
                <Alert message="Error" description={error} type="error" showIcon style={{ marginTop: 20 }} />
            )}

            {registrationResult && (
                <Alert
                    message="Registration Successful"
                    description={
                        <div>
                            <p>
                                <strong style={{ color: '#000' }}>User ID:</strong> {registrationResult.User_ID}
                            </p>
                            <p>
                                <strong style={{ color: '#000' }}>Wallet ID:</strong> {registrationResult.walletID}
                            </p>
                            <p>
                                <strong style={{ color: '#000' }}>Public Key:</strong> {registrationResult.publicKey}
                            </p>
                        </div>
                    }
                    type="success"
                    showIcon
                    style={{ marginTop: 20 }}
                />
            )}
        </div>
    );
};

export default RegistrationForm;
