import React, { useState } from 'react';
import LetterApp from './components/LetterApp.jsx';
import AuthPage from './components/AuthPage.jsx';

export default function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const handleLogin = (token, loggedInUsername) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', loggedInUsername);
    setAuthToken(token);
    setUsername(loggedInUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setAuthToken(null);
    setUsername(null);
  };

  if (authToken && username) {
    return <LetterApp onLogout={handleLogout} username={username} />;
  } else {
    return <AuthPage onLogin={handleLogin} />;
  }
}
