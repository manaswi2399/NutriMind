import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Navigation.css';
import { useThemeMode } from "../context/ThemeContext";

interface NavigationProps {
  activeView: 'home' | 'diet' | 'ingredients'| 'favorites';
  setActiveView: (view: 'home' | 'diet' | 'ingredients'| 'favorites') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, setActiveView }) => {
  const { mode, toggleMode } = useThemeMode();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div className="nav-logo" onClick={() => { setActiveView('home'); setMenuOpen(false); }}>
          <span className="logo-icon">🥗</span>
          <span className="logo-text">NutriMind</span>
        </div>

        <button
          className={`nav-toggle ${menuOpen ? 'open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="toggle-icon">{menuOpen ? '✕' : '☰'}</span>
        </button>

        <div className={`nav-links ${menuOpen ? 'mobile-open' : ''}`} onClick={() => setMenuOpen(false)}>
          <button
            className={`nav-link ${activeView === "home" ? "active" : ""}`}
            onClick={() => setActiveView("home")}
          >
            Home
          </button>

          <button
            className={`nav-link ${activeView === "diet" ? "active" : ""}`}
            onClick={() => setActiveView("diet")}
          >
            Meal Plan
          </button>

          <button
            className={`nav-link ${activeView === "ingredients" ? "active" : ""}`}
            onClick={() => setActiveView("ingredients")}
          >
            Find Recipes
          </button>

          <button
            className={`nav-link ${activeView === "favorites" ? "active" : ""}`}
            onClick={() => setActiveView("favorites")}
          >
            Favorites
          </button>

          <button
            className="nav-link"
            onClick={toggleMode}
          >
            {mode === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

      </div>
    </motion.nav>
  );
};

export default Navigation;
