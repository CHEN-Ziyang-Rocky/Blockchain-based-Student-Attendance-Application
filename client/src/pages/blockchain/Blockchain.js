// src/pages/blockchain/Blockchain.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Blockchain.css';

const Blockchain = () => {
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        // Fetch the blockchain data from the backend
        axios.get('http://localhost:3001/blockchain/blocks')
            .then(response => {
                setBlocks(response.data);
            })
            .catch(error => {
                console.error('Error fetching blocks:', error);
            });
    }, []);

    // Helper functions
    const formatTime = (timestamp) => {
        if (!timestamp) return 'N/A';
        const timeInMS = new Date(timestamp * 1000);
        return timeInMS.toLocaleString();
    };

    const formatHash = (hashString) => {
        if (!hashString || hashString === '0') return '<empty>';
        return `${hashString.substr(0, 5)}...${hashString.substr(hashString.length - 5, 5)}`;
    };

    const formatAmount = (amount) => {
        if (amount === undefined || amount === null) return '0';
        return amount.toLocaleString();
    };

    const getClassByType = (type) => {
        const classByType = {
            'regular': 'is-primary',
            'fee': 'is-warning',
            'reward': 'is-danger',
            'registration': 'is-info',
        };
        return classByType[type] || '';
    };

    return (
        <div className="blockchain-container">
            <div className="header">
                <h2 className="title" style={{ color: '#000' }}>Blockchain</h2>
                <div className="tags">
                    <span className="tag">Type</span>
                    <span className="tag is-primary">Regular</span>
                    <span className="tag is-warning">Fee</span>
                    <span className="tag is-danger">Reward</span>
                    <span className="tag is-info">Registration</span>
                </div>
            </div>
            <hr />
            <div className="blocks">
                <div className="block-grid">
                    {blocks.map(block => (
                        <div className="block" key={block.index}>
                            <div className="block-header">
                                <h3>
                                    Block <small>#{block.index}</small>
                                </h3>
                                <p>
                                    Hash: <span className="tooltip">{formatHash(block.hash)}
                                        <span className="tooltiptext">{block.hash}</span>
                                    </span>
                                    {block.index > 0 && block.previousHash && (
                                        <>
                                            <br />
                                            Previous: <span className="tooltip">{formatHash(block.previousHash)}
                                                <span className="tooltiptext">{block.previousHash}</span>
                                            </span>
                                        </>
                                    )}
                                </p>
                                <hr />
                            </div>
                            {block.index > 0 ? (
                                <div className="transactions">
                                    {block.transactions.map((transaction, txIndex) => (
                                        (transaction.data.inputs.length > 0 || transaction.data.outputs.length > 0) && (
                                            <div className={`notification ${getClassByType(transaction.type)}`} key={txIndex}>
                                                <div className="inputs">
                                                    {transaction.data.inputs.map((input, inputIndex) => (
                                                        <p key={inputIndex}>
                                                            <span className="icon">&#8594;</span>
                                                            {formatAmount(input.amount)} from
                                                            <span className="tooltip">{formatHash(input.address)}
                                                                <span className="tooltiptext">{input.address}</span>
                                                            </span>
                                                        </p>
                                                    ))}
                                                </div>
                                                <div className="outputs">
                                                    {transaction.data.outputs.map((output, outputIndex) => (
                                                        <p key={outputIndex}>
                                                            <span className="icon">&#8594;</span>
                                                            {formatAmount(output.amount)} to
                                                            <span className="tooltip">
                                                                {output.address ? formatHash(output.address) : '(No address available)'}
                                                                {output.address && <span className="tooltiptext">{output.address}</span>}
                                                            </span>
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    ))}
                                    <p className="timestamp">
                                        {block.timestamp ? formatTime(block.timestamp) : 'N/A'}
                                    </p>
                                </div>
                            ) : (
                                <div className="genesis">
                                    <h3 className="subtitle">Genesis</h3>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blockchain;
