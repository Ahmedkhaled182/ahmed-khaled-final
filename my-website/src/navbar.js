import React, { useEffect, useState } from 'react';
import './navbar.css';

function Navbar({ navigate }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
  }, []);

  return (
    <nav className="navbar">
      <button onClick={() => navigate('home')}>Home</button>
      <button onClick={() => navigate('men-products')}>Men</button>
      <button onClick={() => navigate('women-products')}>Women</button>
      <button onClick={() => navigate('cart')}>Cart</button>
      <button onClick={() => navigate('login')}>Logout</button>
      {isAdmin && <button onClick={() => navigate('admin')}>Admin</button>}
    </nav>
  );
}

export default Navbar;
