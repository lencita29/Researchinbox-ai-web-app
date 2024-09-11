import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login'; // Your login component
import Onebox from './components/Onebox'; // The Onebox component or other components

const App = () => {
  const navigate = useNavigate();

  const extractToken = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('authToken', token); // Store the token
      navigate('/onebox'); // Redirect after storing token
    }
  };

  useEffect(() => {
    extractToken();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/onebox" element={<Onebox />} />
      {/* Add other routes as needed */}
    </Routes>
  );
};

export default App;
