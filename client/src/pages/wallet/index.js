import React, { useState } from "react";
import axios from "axios";
import "./index.css";

const WalletAndSecretKey = () => {
    const [walletId, setWalletId] = useState(""); // For Wallet ID to fetch details
    const [walletAddress, setWalletAddress] = useState(""); // For Wallet Address to fetch balance
    const [password, setPassword] = useState("");
    const [walletDetails, setWalletDetails] = useState(null);
    const [secretKey, setSecretKey] = useState("");
    const [balance, setBalance] = useState(null); // State for wallet balance
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Fetch Wallet details using Wallet ID
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

    // Fetch Secret Key based on Wallet ID and Password
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

    // Fetch Wallet Balance using Wallet Address
    const handleFetchBalance = async () => {
        try {
            setError("");
            const response = await axios.get(`http://localhost:3001/operator/${walletAddress}/balance`);
            setBalance(response.data.balance);
        } catch (err) {
            setError("Failed to fetch balance.");
        }
    };

    return (
        <div className="wallet-and-secret-key-container">
            <h1 style={{ color: '#000' }}>Get Wallet and Secret Key</h1>

            {/* Wallet Details Section */}
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

            {/* Balance Section */}
            <div className="balance-section">
                <h2 style={{ color: '#000' }}>Wallet Balance</h2>
                <input
                    type="text"
                    placeholder="Enter Wallet Address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                />
                <button onClick={handleFetchBalance}>Get Wallet Balance</button>
                {balance !== null && (
                    <div className="wallet-info">
                        <p><strong>Balance:</strong> {balance} units</p>
                    </div>
                )}
            </div>

            {/* Retrieve Secret Key Section */}
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

            {/* Error Section */}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default WalletAndSecretKey;
