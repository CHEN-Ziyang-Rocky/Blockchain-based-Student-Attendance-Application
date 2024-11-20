import React, { useState } from "react";
import axios from "axios";
import "./GetSecretKey.css";

const GetSecretKey = () => {
    const [walletId, setWalletId] = useState("");
    const [password, setPassword] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSecretKey("");

        try {
            const response = await axios.post("http://localhost:3001/operator/getSecretKey", {
                walletId,
                password,
            });

            setSecretKey(response.data.secretKey);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to retrieve secret key.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="get-secret-key-container">
            <h1 style={{ color: '#000' }}>Retrieve Secret Key</h1>
            <form onSubmit={handleSubmit} className="get-secret-key-form">
                <div className="form-group">
                    <label htmlFor="walletId">Wallet ID:</label>
                    <input
                        type="text"
                        id="walletId"
                        value={walletId}
                        onChange={(e) => setWalletId(e.target.value)}
                        required
                        placeholder="Enter your wallet ID"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" className="submit-button" disabled={isLoading}>
                    {isLoading ? "Retrieving..." : "Get Secret Key"}
                </button>
            </form>

            {secretKey && (
                <div className="success-message">
                    <p>Your Secret Key:</p>
                    <pre>{secretKey}</pre>
                </div>
            )}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default GetSecretKey;
