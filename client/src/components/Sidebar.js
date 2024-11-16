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
                        Student Information Registration
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/attendance" activeClassName="active">
                        Attendance Information Recording
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
