import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

interface IngredientFormProps {
  setRecipes: (recipes: Recipe[]) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}

const IngredientForm: React.FC<IngredientFormProps> = ({
  setRecipes,
  loading,
  setLoading
}) => {
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState('any');
  const [difficulty, setDifficulty] = useState('medium');
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
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      const payload = {
        ingredients: ingredientList,
        dietary_restrictions: [],
        meal_type: null,
        cuisine: cuisine === 'any' ? null : cuisine,
        cooking_time: null,
        servings: 4
      };

      console.log("Sending recipe search payload:", payload);

      const response = await fetch("https://nutrimind-i2w3.onrender.com/api/recipes/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("Search API error:", err);
        setError("Failed to search recipes");
        return;
      }

      const data = await response.json();
      console.log("Recipe search response:", data);

      const recipesArray = data.recipes || data || [];
      setRecipes(recipesArray);

      if (recipesArray.length === 0) {
        setError("No recipes found. Try different ingredients!");
      }

    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search recipes");
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
                  placeholder="Enter ingredients separated by commas (e.g., rice, tomato, egg)"
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
                <div className="error-message">{error}</div>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      {/* Loading Section */}
      {loading && (
        <section className="results-section">
          <div className="loading-container">
            <div className="spinner-large"></div>
            <p>Finding delicious recipes...</p>
          </div>
        </section>
      )}
    </>
  );
};

export default IngredientForm;
