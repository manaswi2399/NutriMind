import React from 'react';
import { motion } from 'framer-motion';
import { Recipe } from '../App';
import './RecipeCards.css';

interface RecipeCardsProps {
  recipes: Recipe[];
}

const RecipeCards: React.FC<RecipeCardsProps> = ({ recipes }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="recipe-cards-section">
      <div className="results-header">
        <h2 className="results-title">Your Personalized Results</h2>
        <p className="results-count">{recipes.length} recipes found</p>
      </div>

      <motion.div
        className="recipe-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {recipes.map((recipe, index) => (
          <motion.div key={recipe.id} variants={item} className="recipe-card glass">
            <div className="recipe-card-header">
              <div className="recipe-image">
                <div className="recipe-emoji">
                  {['🍽️', '🥗', '🍜', '🍳', '🥙', '🍲', '🥘', '🍱'][index % 8]}
                </div>
              </div>
              {recipe.cookTime && (
                <div className="recipe-time">
                  <span className="time-icon">⏱️</span>
                  {recipe.cookTime}
                </div>
              )}
            </div>

            <div className="recipe-content">
              <h3 className="recipe-name">{recipe.name}</h3>
              <p className="recipe-description">{recipe.description}</p>

              {(recipe.calories || recipe.protein) && (
                <div className="recipe-nutrition">
                  {recipe.calories && (
                    <div className="nutrition-item">
                      <span className="nutrition-label">Calories</span>
                      <span className="nutrition-value">{recipe.calories}</span>
                    </div>
                  )}
                  {recipe.protein && (
                    <div className="nutrition-item">
                      <span className="nutrition-label">Protein</span>
                      <span className="nutrition-value">{recipe.protein}g</span>
                    </div>
                  )}
                  {recipe.carbs && (
                    <div className="nutrition-item">
                      <span className="nutrition-label">Carbs</span>
                      <span className="nutrition-value">{recipe.carbs}g</span>
                    </div>
                  )}
                  {recipe.fat && (
                    <div className="nutrition-item">
                      <span className="nutrition-label">Fat</span>
                      <span className="nutrition-value">{recipe.fat}g</span>
                    </div>
                  )}
                </div>
              )}

              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <div className="recipe-ingredients">
                  <h4 className="ingredients-title">Ingredients:</h4>
                  <ul className="ingredients-list">
                    {recipe.ingredients.slice(0, 5).map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                    {recipe.ingredients.length > 5 && (
                      <li className="more-items">+{recipe.ingredients.length - 5} more</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className="recipe-footer">
              <button className="recipe-btn btn-view">View Full Recipe</button>
              <button className="recipe-btn btn-save">
                <span>❤️</span>
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default RecipeCards;
