import React, { useState } from 'react';
import LetterApp from './components/LetterApp.jsx';
import AuthPage from './components/AuthPage.jsx';

export default function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const handleLogin = (tokens, loggedInUsername) => {
    // Store both access and refresh tokens
    localStorage.setItem('authToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    localStorage.setItem('username', loggedInUsername);
    setAuthToken(tokens.access);
    setUsername(loggedInUsername);
  };

  const handleLogout = () => {
    // Remove all session-related items
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
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
