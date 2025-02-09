import React, { useEffect, useState } from 'react';
import './admin.css';

function AdminPage({ navigate }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:555/admin/orders', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => setErrorMessage('Error fetching orders'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-page">
      <h1>Orders</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
       {orders.length === 0 ? <p>No orders have been placed yet.</p> : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              <h3>Order ID: {order.ID}</h3>
              <p><strong>User ID:</strong> {order.USER_ID}</p>
              <p><strong>Items:</strong> {order.ITEMS}</p>
              <p><strong>Total Price:</strong> ${order.TOTAL_PRICE.toFixed(2)}</p>
              <p><strong>Date:</strong> {new Date(order.ORDER_DATE).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
      <button className="back-button" onClick={() => navigate('home')}>Back to Home</button>
    </div>
  );
}

export default AdminPage;
