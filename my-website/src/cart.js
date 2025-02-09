import React, { useEffect, useState } from 'react';
import './cart.css';

function Cart({ navigate }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:555/cart', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setCartItems(data))
      .catch(err => console.error('Error fetching cart:', err));
  }, []);

  const clearCart = () => {
    fetch('http://localhost:555/cart/clear', { method: 'DELETE', credentials: 'include' })
      .then(() => setCartItems([]))
      .catch(err => console.error('Error clearing cart:', err));
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? <p>Your cart is empty.</p> : (
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <h3>{item.NAME}</h3>
              <p>{item.BRAND}</p>
              <p>Price: ${item.PRICE.toFixed(2)}</p>
              <p>Quantity: {item.QUANTITY}</p>
            </div>
          ))}
        </div>
      )}
      {cartItems.length > 0 && (
        <div className="cart-actions">
          <button onClick={clearCart}>Clear Cart</button>
          <button onClick={() => navigate('checkout')}>Checkout</button>
        </div>
      )}
    </div>
  );
}

export default Cart;
