import React, { useState } from 'react';
import './signup.css';

function SignUp({ navigate }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:555/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(await response.text());
      navigate('login');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="sign-up-container">
      <h1 className="title-signup">Scented Secret</h1>

      <h2>Sign Up</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}

      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />

      <button className="submit-button" onClick={handleSubmit}>Sign Up</button>

      <p className="text">
        Already have an account? <a href="#" className="link" onClick={(e) => { e.preventDefault(); navigate('login'); }}>Login</a>
      </p>
    </div>
  );
}

export default SignUp;
