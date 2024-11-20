// src/components/Sidebar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // For sidebar styling

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Student Attendance</h2>
            <ul>
                <li>
                    <NavLink to="/" end activeClassName="active">
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/register" activeClassName="active">
                        Information Registration
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/walletDetails" activeClassName="active">
                        Check Wallet Details
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/walletList" activeClassName="active">
                        Check Wallet List
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/getSecretKey" activeClassName="active">
                        Get the Secret Key
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/attendance" activeClassName="active">
                        Record Attendance
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/event" activeClassName="active">
                        Teacher Create Event ID
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/mint" activeClassName="active">
                        Mint
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/query" activeClassName="active">
                        Record Querying
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/blockchain" activeClassName="active">
                        Blockchain
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/transactions/unconfirmed" activeClassName="active">
                        Unconfirmed Transactions
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
