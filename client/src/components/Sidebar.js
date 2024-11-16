// src/components/Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // 为侧边栏添加样式

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>功能选择</h2>
            <ul>
                <li>
                    <Link to="/">Student Information Registration</Link>
                </li>
                <li>
                    <Link to="/attendance">Attendance Information Recording</Link>
                </li>
                <li>
                    <Link to="/mint">Mint</Link>
                </li>
                <li>
                    <Link to="/query">Record Querying</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
