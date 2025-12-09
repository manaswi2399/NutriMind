import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { searchRecipes } from '../api';
import './IngredientForm.css';

interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  total_time: number;
  servings: number;
  difficulty: string;
  cuisine?: string;
  meal_type?: string;
  nutrition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  tags: string[];
  image_url?: string;
}

const IngredientForm: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState('any');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ingredients.trim()) {
      setError('Please enter at least one ingredient');
      return;
    }

    setLoading(true);
    setError('');
    setRecipes([]);

    try {
      const ingredientList = ingredients
        .split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0);

      const response = await searchRecipes({
        ingredients: ingredientList,
        cuisine: cuisine === 'any' ? null : cuisine,
        servings: 4
      });

      setRecipes(response.recipes);
      
      if (response.recipes.length === 0) {
        setError('No recipes found. Try different ingredients!');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search recipes');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      {loading && (
        <section className="results-section">
          <div className="loading-container">
            <div className="spinner-large"></div>
            <p>Finding delicious recipes...</p>
          </div>
        </section>
      )}

      {!loading && recipes.length > 0 && (
        <section className="results-section">
          <div className="results-header">
            <h2>Found {recipes.length} Recipe{recipes.length !== 1 ? 's' : ''}</h2>
          </div>
          
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                className="recipe-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="recipe-header">
                  <h3>{recipe.name}</h3>
                  <span className={`difficulty-badge ${recipe.difficulty}`}>
                    {recipe.difficulty}
                  </span>
                </div>

                <p className="recipe-description">{recipe.description}</p>

                <div className="recipe-meta">
                  <div className="meta-item">
                    <span className="icon">⏱️</span>
                    <span>{recipe.total_time} min</span>
                  </div>
                  <div className="meta-item">
                    <span className="icon">🔥</span>
                    <span>{recipe.nutrition.calories} cal</span>
                  </div>
                  <div className="meta-item">
                    <span className="icon">👥</span>
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>

                <div className="recipe-ingredients">
                  <strong>Ingredients:</strong>
                  <ul>
                    {recipe.ingredients.slice(0, 5).map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                    {recipe.ingredients.length > 5 && (
                      <li className="more-items">
                        + {recipe.ingredients.length - 5} more...
                      </li>
                    )}
                  </ul>
                </div>

                <div className="recipe-nutrition">
                  <strong>Nutrition (per serving):</strong>
                  <div className="nutrition-stats">
                    <span>Protein: {recipe.nutrition.protein}g</span>
                    <span>Carbs: {recipe.nutrition.carbohydrates}g</span>
                    <span>Fat: {recipe.nutrition.fat}g</span>
                  </div>
                </div>

                {recipe.tags.length > 0 && (
                  <div className="recipe-tags">
                    {recipe.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default IngredientForm;
