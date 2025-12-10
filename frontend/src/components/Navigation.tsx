import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Navigation.css';

interface NavigationProps {
  activeView: 'home' | 'diet' | 'ingredients'| 'favorites';
  setActiveView: (view: 'home' | 'diet' | 'ingredients'| 'favorites') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, setActiveView }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`navigation ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container">
        <div className="nav-logo" onClick={() => setActiveView('home')}>
          <span className="logo-icon">🥗</span>
          <span className="logo-text">NutriMind</span>
        </div>

        <div className="nav-links">
          <button
            className={`nav-link ${activeView === 'home' ? 'active' : ''}`}
            onClick={() => setActiveView('home')}
          >
            Home
          </button>
          <button
            className={`nav-link ${activeView === 'diet' ? 'active' : ''}`}
            onClick={() => setActiveView('diet')}
          >
            Meal Plan
          </button>
          <button
            className={`nav-link ${activeView === 'ingredients' ? 'active' : ''}`}
            onClick={() => setActiveView('ingredients')}
          >
            Find Recipes
          </button>
          
          <button
            className={`nav-link ${activeView === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveView('favorites')}
          >
            Favorites
          </button>

        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
