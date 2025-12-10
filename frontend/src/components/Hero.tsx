import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

interface HeroProps {
  setActiveView: (view: 'home' | 'diet' | 'ingredients') => void;
}

const Hero: React.FC<HeroProps> = ({ setActiveView }) => {
  return (
    <section className="hero">
      {/* Decorative Background Elements */}
      <div className="hero-bg-decoration"></div>
      <div className="hero-bg-pattern"></div>
      <div className="sparkles">
        <span className="sparkle sparkle-1">✦</span>
        <span className="sparkle sparkle-2">✦</span>
        <span className="sparkle sparkle-3">✦</span>
        <span className="sparkle sparkle-4">✦</span>
        <span className="sparkle sparkle-5">✦</span>
        <span className="sparkle sparkle-6">✦</span>
      </div>

      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="hero-title">
            <span className="title-main">
              <span className="title-accent">Nutri</span>
              <span className="title-white">Mind</span>
            </span>
            <span className="title-sub">AI-POWERED NUTRITION</span>
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
            className="btn btn-primary btn-large btn-primary-enhanced"
            onClick={() => setActiveView('diet')}
          >
            <span>Plan Your Meals</span>
            <span className="btn-icon">→</span>
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
            <div className="stat-label">RECIPES</div>
          </div>
          <div className="stat">
            <div className="stat-number">50+</div>
            <div className="stat-label">DIET TYPES</div>
          </div>
          <div className="stat">
            <div className="stat-number">AI</div>
            <div className="stat-label">POWERED</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {/* Card 1 - Top Left - Healthy Salads */}
        <motion.div 
          className="floating-card card-1"
          whileHover={{ scale: 1.05, rotate: 0 }}
        >
          <div className="card-image-container salad-image">
            <img 
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop" 
              alt="Healthy Salad"
              className="card-img"
            />
          </div>
          <div className="card-label">Healthy Salads</div>
        </motion.div>
        
        {/* Card 2 - Top Right - Breakfast Ideas */}
        <motion.div 
          className="floating-card card-2"
          whileHover={{ scale: 1.05, rotate: 0 }}
        >
          <div className="card-image-container breakfast-image">
            <img 
              src="https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop" 
              alt="Breakfast"
              className="card-img"
            />
          </div>
          <div className="card-label">Breakfast Ideas</div>
        </motion.div>
        
       
      
        
        {/* Card 4 - Middle Right - Balanced Meals (duplicate with different image) */}
        <motion.div 
          className="floating-card card-4"
          whileHover={{ scale: 1.05, rotate: 0 }}
        >
          <div className="card-image-container bowl-image">
            <img 
              src="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop" 
              alt="Buddha Bowl"
              className="card-img"
            />
          </div>
          <div className="card-label">Balanced Meals</div>
        </motion.div>
        
        {/* Card 5 - Bottom Right - Global Cuisine */}
        <motion.div 
          className="floating-card card-5"
          whileHover={{ scale: 1.05, rotate: 0 }}
        >
          <div className="card-image-container cuisine-image">
            <img 
              src="https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop" 
              alt="Global Cuisine"
              className="card-img"
            />
          </div>
          <div className="card-label">Global Cuisine</div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;