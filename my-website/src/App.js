import React, { useState } from 'react';
import './App.css';
import Navbar from './navbar';
import Login from './login';
import SignUp from './signup';
import Homepage from './homepage';
import MenProducts from './MenProducts';
import WomenProducts from './WomenProducts';
import Cart from './cart';
import Checkout from './checkout';
import AdminPage from './admin';

function App() {
  const [page, setPage] = useState('login');  
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; 

  return (
    <div className="App">
      {page !== 'login' && page !== 'signup' && <Navbar navigate={setPage} />}
      {page === 'login' && <Login navigate={setPage} />}
      {page === 'signup' && <SignUp navigate={setPage} />}
      {page === 'home' && <Homepage navigate={setPage} />}
      {page === 'men-products' && <MenProducts />}
      {page === 'women-products' && <WomenProducts />}
      {page === 'cart' && <Cart navigate={setPage} />}
      {page === 'checkout' && <Checkout navigate={setPage} />}
      {page === 'admin' && isAdmin && <AdminPage navigate={setPage} />}
    </div>
  );
}

export default App;
