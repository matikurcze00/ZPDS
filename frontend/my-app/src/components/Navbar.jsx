import React from 'react';
import './Navbar.css';

const Navbar = ({ activeTab, onTabChange }) => {
  return (
    <nav className="navbar">
      <div className="nav-items">
        <button 
          className={`nav-item ${activeTab === 'zestawy' ? 'active' : ''}`}
          onClick={() => onTabChange('zestawy')}
        >
          <span className="icon">⚙️</span>
          Zestawy wariantowe
        </button>
        <button 
          className={`nav-item ${activeTab === 'wlasne' ? 'active' : ''}`}
          onClick={() => onTabChange('wlasne')}
        >
          <span className="icon">✨</span>
          Stwórz własną konfigurację
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 