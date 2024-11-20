import React, { useState } from "react";
import axios from "axios";
import "./WalletDetails.css";

const WalletDetails = () => {
    const [walletId, setWalletId] = useState("");
    const [walletDetails, setWalletDetails] = useState(null);
    const [error, setError] = useState(null);

    const handleFetchDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/operator/wallets/${walletId}`);
            setWalletDetails(response.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch wallet details.");
            setWalletDetails(null);
        }
    };

    return (
        <div className="wallet-details-container">
            <h1 style={{ color: '#000' }}>Wallet Details</h1>
            <input
                type="text"
                placeholder="Enter Wallet ID"
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
            />
            <button onClick={handleFetchDetails}>Get Details</button>
            {error && <p className="error-message">{error}</p>}
            {walletDetails && (
                <div className="wallet-info">
                    <p><strong style={{ color: '#000' }}>Wallet ID:</strong> {walletDetails.id}</p>
                    <p><strong style={{ color: '#000' }}>Addresses:</strong> {walletDetails.addresses.join(", ")}</p>
                </div>
            )}
        </div>
    );
};

export default WalletDetails;
