// src/router/index.js
import { createBrowserRouter } from 'react-router-dom';
import RegistrationForm from '../pages/login/RegistrationForm';
import Home from '../pages/home/Home';
//import Attendance from '../pages/attendance/Attendance';
//import Mint from '../pages/mint/Mint';
//import RecordQuery from '../pages/recordQuery/RecordQuery';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RegistrationForm />,
    },
    {
        path: '/home',
        element: <Home />,
    },
    /*
    {
        path: '/attendance',
        element: <Attendance />,
    },
    {
        path: '/mint',
        element: <Mint />,
    },
    {
        path: '/query',
        element: <RecordQuery />,
    },
    */
]);

export default router;
