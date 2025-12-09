import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

interface HeroProps {
  setActiveView: (view: 'home' | 'diet' | 'ingredients') => void;
}

const Hero: React.FC<HeroProps> = ({ setActiveView }) => {
  return (
    <section className="hero">
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="hero-title">
            <span className="title-main">NutriMind</span>
            <span className="title-sub">AI-Powered Nutrition</span>
          </h1>
        </motion.div>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Transform your eating habits with intelligent meal planning and personalized recipe suggestions powered by advanced AI
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button
            className="btn btn-primary btn-large"
            onClick={() => setActiveView('diet')}
          >
            Plan Your Meals
          </button>
          <button
            className="btn btn-secondary btn-large"
            onClick={() => setActiveView('ingredients')}
          >
            Find Recipes
          </button>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="stat">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Recipes</div>
          </div>
          <div className="stat">
            <div className="stat-number">50+</div>
            <div className="stat-label">Diet Types</div>
          </div>
          <div className="stat">
            <div className="stat-number">AI</div>
            <div className="stat-label">Powered</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="floating-card card-1">
          <div className="card-icon">🥗</div>
          <div className="card-text">Healthy Salads</div>
        </div>
        <div className="floating-card card-2">
          <div className="card-icon">🍳</div>
          <div className="card-text">Breakfast Ideas</div>
        </div>
        <div className="floating-card card-3">
          <div className="card-icon">🥙</div>
          <div className="card-text">Balanced Meals</div>
        </div>
        <div className="floating-card card-4">
          <div className="card-icon">🍜</div>
          <div className="card-text">Global Cuisine</div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
