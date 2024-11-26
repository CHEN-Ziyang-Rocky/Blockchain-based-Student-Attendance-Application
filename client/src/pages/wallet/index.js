import React, { useState } from "react";
import axios from "axios";
import "./index.css";

const WalletAndSecretKey = () => {
    const [walletId, setWalletId] = useState("");
    const [password, setPassword] = useState("");
    const [walletDetails, setWalletDetails] = useState(null);
    const [secretKey, setSecretKey] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleFetchDetails = async () => {
        try {
            setError("");
            setWalletDetails(null);
            const response = await axios.get(`http://localhost:3001/operator/wallets/${walletId}`);
            setWalletDetails(response.data);
        } catch (err) {
            setError("Failed to fetch wallet details.");
        }
    };

    const handleRetrieveSecretKey = async (e) => {
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
        <div className="wallet-and-secret-key-container">
            <h1 style={{ color: '#000' }}>Get Wallet and Secret Key</h1>

            <div className="wallet-details-section">
                <h2 style={{ color: '#000' }}>Wallet Details</h2>
                <input
                    type="text"
                    placeholder="Enter Wallet ID"
                    value={walletId}
                    onChange={(e) => setWalletId(e.target.value)}
                />
                <button onClick={handleFetchDetails}>Get Wallet Details</button>
                {walletDetails && (
                    <div className="wallet-info">
                        <p>
                            <strong>Wallet ID:</strong> {walletDetails.id}
                        </p>
                        <p>
                            <strong>Addresses:</strong> {walletDetails.addresses.join(", ")}
                        </p>
                    </div>
                )}
            </div>

            <div className="get-secret-key-section">
                <h2 style={{ color: '#000' }}>Retrieve Secret Key</h2>
                <form onSubmit={handleRetrieveSecretKey} className="get-secret-key-form">
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
            </div>

            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default WalletAndSecretKey;