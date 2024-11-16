// src/App.js

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import RegistrationForm from './pages/login/RegistrationForm';
import Sidebar from './components/Sidebar';
import './App.css';
import router from './router';

function App() {
  return (
    <RegistrationForm />
    /*
      <RouterProvider router={router} />
    */
  );
}

export default App;
