import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recipe } from '../App';
import './RecipeCards.css';

interface RecipeCardsProps {
  recipes: Recipe[];
  favorites: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

const RecipeCards: React.FC<RecipeCardsProps> = ({ recipes, favorites, onToggleFavorite, onSelectRecipe}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

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

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
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
                <button 
                  className="recipe-btn btn-view"
                  onClick={() => handleViewRecipe(recipe)}
                >
                  View Full Recipe
                </button>

                <button
                  className="recipe-btn btn-save"
                  onClick={() => onToggleFavorite(recipe)}
                >
                  <span style={{ fontSize: "1.3rem" }}>
                    {favorites.some((fav) => fav.id === recipe.id) ? "❤️" : "🤍"}
                  </span>
                </button>

              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            className="recipe-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="recipe-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={handleCloseModal}>
                ✕
              </button>

              <div className="modal-header">
                <h2 className="modal-title">{selectedRecipe.name}</h2>
                <div className="modal-meta">
                  {selectedRecipe.cookTime && (
                    <span className="modal-meta-item">
                      ⏱️ {selectedRecipe.cookTime}
                    </span>
                  )}
                  {selectedRecipe.servings && (
                    <span className="modal-meta-item">
                      👥 {selectedRecipe.servings} servings
                    </span>
                  )}
                </div>
              </div>

              <div className="modal-body">
                <p className="modal-description">{selectedRecipe.description}</p>

                {/* Nutrition */}
                {(selectedRecipe.calories || selectedRecipe.protein) && (
                  <div className="modal-section">
                    <h3 className="modal-section-title">Nutrition Facts</h3>
                    <div className="modal-nutrition">
                      {selectedRecipe.calories && (
                        <div className="modal-nutrition-item">
                          <span className="label">Calories</span>
                          <span className="value">{selectedRecipe.calories}</span>
                        </div>
                      )}
                      {selectedRecipe.protein && (
                        <div className="modal-nutrition-item">
                          <span className="label">Protein</span>
                          <span className="value">{selectedRecipe.protein}g</span>
                        </div>
                      )}
                      {selectedRecipe.carbs && (
                        <div className="modal-nutrition-item">
                          <span className="label">Carbs</span>
                          <span className="value">{selectedRecipe.carbs}g</span>
                        </div>
                      )}
                      {selectedRecipe.fat && (
                        <div className="modal-nutrition-item">
                          <span className="label">Fat</span>
                          <span className="value">{selectedRecipe.fat}g</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Ingredients */}
                {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 && (
                  <div className="modal-section">
                    <h3 className="modal-section-title">Ingredients</h3>
                    <ul className="modal-ingredients">
                      {selectedRecipe.ingredients.map((ingredient, i) => (
                        <li key={i}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Instructions */}
                {selectedRecipe.instructions && selectedRecipe.instructions.length > 0 && (
                  <div className="modal-section">
                    <h3 className="modal-section-title">Instructions</h3>
                    <ol className="modal-instructions">
                      {selectedRecipe.instructions.map((instruction, i) => (
                        <li key={i}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RecipeCards;