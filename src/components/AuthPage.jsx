import React, { useState } from 'react';
import { apiService } from '../services/apiService.js';
import { Spinner, EyeIcon, EyeSlashIcon } from './icons.jsx';

const AuthPage = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); setMessage(''); setError('');
    try {
      const data = await apiService.login(username, password);
      onLogin(data, username);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true); setMessage(''); setError('');
    try {
      await apiService.signup(email);
      setMessage(`Credentials sent to email ${email}`);
      setMode('login');
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true); setMessage(''); setError('');
    try {
      const data = await apiService.requestPasswordReset(email);
      setMessage(data.message);
      setMode('login');
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">Letter Registration</h1>
        <p className="text-center text-slate-500 mb-8">Please sign in to continue</p>
        
        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{message}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-slate-800 text-base mb-2" htmlFor="username">Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="username" type="text" placeholder="name.surname" required />
            </div>
            <div className="mb-6 relative">
              <label className="block text-slate-800 text-base mb-2" htmlFor="password">Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-slate-700 pr-10 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="password" type={showPassword ? 'text' : 'password'} placeholder="******************" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-slate-500 hover:text-slate-700">
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
            <button disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center" type="submit">
              {isLoading ? <Spinner /> : 'Sign In'}
            </button>
            <p className="text-center text-base text-slate-500 mt-4">
              <a href="#" onClick={() => {setMode('reset'); setMessage(''); setError('');}} className="text-blue-600 hover:text-blue-800">Forgot Password?</a>
            </p>
          </form>
        )}
        
        {mode === 'signup' && (
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="email">Work Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700" id="email" type="email" placeholder="name.surname@mosaic-insurance.com" required />
              <p className="text-xs text-slate-500 mt-1">Must be a valid @mosaic-insurance.com address.</p>
            </div>
            <button disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center" type="submit">
              {isLoading ? <Spinner /> : 'Send Login Credentials'}
            </button>
          </form>
        )}
        
        {mode === 'reset' && (
            <form onSubmit={handleResetRequest}>
                <p className="text-sm text-slate-600 mb-4">Enter your email address and we will send you a link to reset your password.</p>
                <div className="mb-4">
                    <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="email-reset">Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700" id="email-reset" type="email" placeholder="name.surname@mosaic-insurance.com" required />
                </div>
                <button disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center" type="submit">
                    {isLoading ? <Spinner /> : 'Send Reset Link'}
                </button>
            </form>
        )}

        <p className="text-center text-base text-slate-500 mt-8">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          <a href="#" onClick={() => {setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); setError('');}} className="text-blue-600 hover:text-blue-800 ml-1">
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;