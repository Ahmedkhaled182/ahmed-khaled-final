import React from 'react';
import './homepage.css';

function Homepage({ navigate }) {
    return (
      <div className="homepage-page">
        <div className="homepage-welcome-section">
          <h1 className="homepage-title">Welcome to Scented Secrets</h1>
          
          <p className="homepage-subtitle">Discover your perfect fragrance!</p>
        </div>
  
        <div className="homepage-featured-grid">
          <div className="homepage-featured-item">
            <img src="https://th.bing.com/th/id/OIP.yZ2Sj6rAdZ6FRjLX3LmVFQHaE8?rs=1&pid=ImgDetMain" alt="For Him" />
            <h3>Men's Fragrances</h3>
            <button onClick={() => navigate('men-products')}>For Him</button>
          </div>
  
          <div className="homepage-featured-item">
            <img src="https://www.fashiongonerogue.com/wp-content/uploads/2021/05/Beauty-Model-Spraying-Perfume-Blue-Bottle-450x300.jpg" alt="For Her" />
            <h3>Women's Fragrances</h3>
            <button onClick={() => navigate('women-products')}>For Her</button>
          </div>
        </div>
  
        <footer className="homepage-footer">
          <p>&copy; 2024 Scented Secrets. All Rights Reserved.</p>
        </footer>
      </div>
    );
  }

export default Homepage;
