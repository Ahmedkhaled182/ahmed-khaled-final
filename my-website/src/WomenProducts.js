import React, { useEffect, useState } from 'react';
import './women.css';

function WomenProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:555/products?category=women')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching women products:', err));
  }, []);

  const addToCart = (perfumeId) => {
    fetch('http://localhost:555/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ perfumeId, quantity: 1 }),
      credentials: 'include'
    })
      .then(res => res.ok ? alert('Item added to cart!') : alert('Failed to add item to cart.'))
      .catch(err => console.error('Error adding item to cart:', err));
  };

  return (
    <div className="products-page">
      <h1>Women's Fragrances</h1>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.ID} className="product-card">
            <img src={product.IMAGE_URL || '/placeholder.jpg'} alt={product.NAME} />
            <h3>{product.NAME}</h3>
            <p>{product.BRAND}</p>
            <p>${product.PRICE.toFixed(2)}</p>
            <button onClick={() => addToCart(product.ID)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WomenProducts;
