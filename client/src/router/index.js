// src/router/index.js

import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import RegistrationForm from '../pages/login/RegistrationForm';
import Home from '../pages/home/Home';
import Blockchain from '../pages/blockchain/Blockchain';
import UnconfirmedTransactions from '../pages/transactions/UnconfirmedTransactions';
import Mint from '../pages/mint/Mint';
import Attendance from '../pages/attendance/Attendance';
import Querying from '../pages/query/Querying';
import WalletDetails from '../pages/wallet/WalletDetails';
import WalletList from '../pages/wallet/WalletList';
import GetSecretKey from '../pages/wallet/GetSecretKey';
// Import other pages as needed

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'register',
                element: <RegistrationForm />,
            },
            {
                path: 'walletDetails',
                element: <WalletDetails />,
            },
            {
                path: 'walletList',
                element: <WalletList />,
            },
            {
                path: 'getSecretKey',
                element: <GetSecretKey />,
            },
            {
                path: 'attendance',
                element: <Attendance />,
            },
            {
                path: 'mint',
                element: <Mint />,
            },
            {
                path: 'query',
                element: <Querying />,
            },
            {
                path: '/blockchain',
                element: <Blockchain />
            },
            {
                path: 'transactions/unconfirmed',
                element: <UnconfirmedTransactions />,
            },
        ],
    },
]);

export default router;
