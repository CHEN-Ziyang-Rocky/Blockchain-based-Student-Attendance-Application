// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 如果你想在应用中开始测量性能，传递一个函数
// 来记录结果（例如：reportWebVitals(console.log)）
// 或者发送到一个分析端点。了解更多：https://bit.ly/CRA-vitals
reportWebVitals();
