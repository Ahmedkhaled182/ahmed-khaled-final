import React, { useState } from 'react';
import './login.css';

function Login({ navigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) return setErrorMessage('Both fields are required');

    try {
      const response = await fetch('http://localhost:555/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      localStorage.setItem('isAdmin', data.admin ? 'true' : 'false');
      navigate('home');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-container">

      <h1 className="title">Scented Secret</h1>

      <h2>Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

      <button className="login-button" onClick={handleSubmit}>Login</button>

      <p className="text">
        Don't have an account? <button className="link" onClick={() => navigate('signup')}>Sign up</button>
      </p>
    </div>
  );
}

export default Login;
