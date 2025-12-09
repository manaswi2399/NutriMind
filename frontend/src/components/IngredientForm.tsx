import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './IngredientForm.css';

interface IngredientFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
}

const IngredientForm: React.FC<IngredientFormProps> = ({ onSubmit, loading }) => {
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState('any');
  const [difficulty, setDifficulty] = useState('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ingredients: ingredients.split(',').map(i => i.trim()),
      cuisine,
      difficulty,
    });
  };

  return (
    <section className="ingredient-form-section">
      <div className="form-container glass">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="form-title">
            <span className="title-icon">🔍</span>
            Find Perfect Recipes
          </h2>
          <p className="form-subtitle">
            Tell us what ingredients you have, and we'll suggest amazing recipes
          </p>

          <form onSubmit={handleSubmit} className="ingredient-form">
            <div className="form-group">
              <label className="form-label">Your Ingredients</label>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="form-textarea ingredient-textarea"
                placeholder="Enter ingredients separated by commas (e.g., chicken, rice, tomatoes, onions)"
                required
              />
              <div className="input-hint">
                💡 Tip: List all ingredients you have available
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Cuisine Preference</label>
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="form-select"
                >
                  <option value="any">Any Cuisine</option>
                  <option value="italian">Italian</option>
                  <option value="chinese">Chinese</option>
                  <option value="mexican">Mexican</option>
                  <option value="indian">Indian</option>
                  <option value="japanese">Japanese</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="american">American</option>
                  <option value="thai">Thai</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="form-select"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Advanced</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={loading || !ingredients.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Searching...
                </>
              ) : (
                <>
                  <span>Find Recipes</span>
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default IngredientForm;
