import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WalletList.css";

const WalletList = () => {
    const [wallets, setWallets] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const response = await axios.get("http://localhost:3001/operator/wallets");
                setWallets(response.data);
            } catch (err) {
                setError("Failed to fetch wallets.");
            }
        };

        fetchWallets();
    }, []);

    return (
        <div className="wallet-list-container">
            <h1>Wallet List</h1>
            {error && <p className="error-message">{error}</p>}
            <ul>
                {wallets.map((wallet) => (
                    <li key={wallet.id}>
                        <strong style={{ color: '#000' }}>Wallet ID:</strong> {wallet.id} <br />
                        <strong style={{ color: '#000' }}>Addresses:</strong> {wallet.addresses.join(", ")}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WalletList;
