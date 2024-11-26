import React, { useState } from "react";
import axios from "axios";
import "./Mint.css";

const Mint = () => {
    const [rewardAddress, setRewardAddress] = useState("");
    const [feeAddress, setFeeAddress] = useState("");
    const [miningResult, setMiningResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleMine = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post("http://localhost:3001/miner/mine", {
                rewardAddress,
                feeAddress: feeAddress || rewardAddress,
            });

            setMiningResult(response.data);
        } catch (err) {
            setError("Failed to mine block. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mint-container">
            <h1>Mint New Block</h1>
            <form onSubmit={handleMine} className="mint-form">
                <div className="form-group">
                    <label htmlFor="rewardAddress">Reward Address</label>
                    <input
                        type="text"
                        id="rewardAddress"
                        value={rewardAddress}
                        onChange={(e) => setRewardAddress(e.target.value)}
                        required
                        placeholder="Enter your reward address"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="feeAddress">Fee Address (Optional)</label>
                    <input
                        type="text"
                        id="feeAddress"
                        value={feeAddress}
                        onChange={(e) => setFeeAddress(e.target.value)}
                        placeholder="Enter fee address or leave blank"
                    />
                </div>
                <button type="submit" className="mine-button" disabled={isLoading}>
                    {isLoading ? "Mining..." : "Start Mining"}
                </button>
            </form>
            {error && <div className="error-message">{error}</div>}
            {miningResult && (
                <div className="result">
                    <h2>Block Mined Successfully!</h2>
                    <pre>{JSON.stringify(miningResult, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default Mint;
