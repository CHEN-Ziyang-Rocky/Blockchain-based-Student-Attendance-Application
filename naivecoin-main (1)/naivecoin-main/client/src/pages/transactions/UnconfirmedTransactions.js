// src/pages/blockchain/UnconfirmedTransactions.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UnconfirmedTransactions.css';

const UnconfirmedTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);

    useEffect(() => {
        let isMounted = true; // To prevent setting state on unmounted component

        axios.get('http://localhost:3001/blockchain/transactions')
            .then(response => {
                if (isMounted) {
                    setTransactions(response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching transactions:', error);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // Helper functions
    const formatHash = (hashString) => {
        if (!hashString || hashString === '0') return '<empty>';
        return `${hashString.substr(0, 5)}...${hashString.substr(hashString.length - 5, 5)}`;
    };

    const formatAmount = (amount) => {
        if (amount === undefined || amount === null) return '0';
        return amount.toLocaleString();
    };

    const toggleRow = (transactionId) => {
        setExpandedRows(prev =>
            prev.includes(transactionId)
                ? prev.filter(id => id !== transactionId)
                : [...prev, transactionId]
        );
    };

    return (
        <div className="transactions-container">
            <h2>Unconfirmed Transactions</h2>
            <hr />
            <table className="transactions-table">
                <thead>
                    <tr>
                        <th style={{ color: '#000' }}>ID</th>
                        <th style={{ color: '#000' }}>Hash</th>
                        <th style={{ color: '#000' }}>Type</th>
                        <th style={{ color: '#000' }}>Inputs</th>
                        <th style={{ color: '#000' }}>Outputs</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <React.Fragment key={transaction.id}>
                            <tr onClick={() => toggleRow(transaction.id)} style={{ cursor: 'pointer' }}>
                                <td>
                                    <span className="tooltip">{formatHash(transaction.id)}
                                        <span className="tooltiptext">{transaction.id}</span>
                                    </span>
                                </td>
                                <td>
                                    <span className="tooltip">{formatHash(transaction.hash)}
                                        <span className="tooltiptext">{transaction.hash}</span>
                                    </span>
                                </td>
                                <td>{transaction.type}</td>
                                <td>{transaction.data.inputs.length}</td>
                                <td>{transaction.data.outputs.length}</td>
                            </tr>
                            {expandedRows.includes(transaction.id) && (
                                <tr>
                                    <td colSpan="5">
                                        <div className="transaction-details">
                                            <div className="inputs">
                                                <h4 style={{ color: '#000' }}>Inputs</h4>
                                                {transaction.data.inputs.map((input, index) => (
                                                    <p key={index}>
                                                        <span className="icon">&#8594;</span>
                                                        Address:
                                                        <span className="tooltip">{formatHash(input.address)}
                                                            <span className="tooltiptext">{input.address}</span>
                                                        </span>
                                                        <br />
                                                        From transaction:
                                                        <span className="tooltip">{formatHash(input.transaction)} : {input.index}
                                                            <span className="tooltiptext">{input.transaction}</span>
                                                        </span>
                                                        <br />
                                                        Amount: {formatAmount(input.amount)}
                                                        <br />
                                                        Signature: {formatHash(input.signature)}
                                                    </p>
                                                ))}
                                            </div>
                                            <div className="outputs">
                                                <h4 style={{ color: '#000' }}>Outputs</h4>
                                                {transaction.data.outputs.map((output, index) => (
                                                    <p key={index}>
                                                        <span className="icon">&#8594;</span>
                                                        Address:
                                                        <span className="tooltip">{formatHash(output.address)}
                                                            <span className="tooltiptext">{output.address}</span>
                                                        </span>
                                                        <br />
                                                        Amount: {formatAmount(output.amount)}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UnconfirmedTransactions;
