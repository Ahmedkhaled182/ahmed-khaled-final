import React, { useEffect, useState } from 'react';
import './checkout.css';

function Checkout({ navigate }) {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('http://localhost:555/cart', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setCartItems(data);
        setTotal(data.reduce((acc, item) => acc + item.PRICE * item.QUANTITY, 0));
      })
      .catch(err => console.error('Error fetching cart items:', err));
  }, []);

  const completePurchase = () => {
    fetch('http://localhost:555/checkout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to complete purchase.');
        alert('Purchase completed successfully!');
        setCartItems([]);
        setTotal(0);
        navigate('home');
      })
      .catch(err => alert(err.message));
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-items">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="checkout-item">
              <h3>{item.NAME}</h3>
              <p>Brand: {item.BRAND}</p>
              <p>Price: ${item.PRICE.toFixed(2)}</p>
              <p>Quantity: {item.QUANTITY}</p>
              <p>Total: ${(item.PRICE * item.QUANTITY).toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
      <h2 className="checkout-total">Total Cost: ${total.toFixed(2)}</h2>
      <button className="checkout-button" onClick={completePurchase}>Complete Purchase</button>

      <footer className="checkout-footer">
        <p>&copy; 2024 Scented Secrets. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Checkout;
