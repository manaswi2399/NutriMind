import React from "react";
import './FavoritesPage.css';
import RecipeCards from "./RecipeCards";
import { Recipe } from "../App";

interface FavoritesPageProps {
  favorites: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favorites,
  onToggleFavorite,
  onSelectRecipe
}) => {
  return (
    <div className="favorites-page">
      <h2>❤️ Your Favorite Recipes</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet. Tap the heart on a recipe to save it!</p>
      ) : (
        <RecipeCards
          recipes={favorites}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          onSelectRecipe={onSelectRecipe}
        />
      )}
    </div>
  );
};

export default FavoritesPage;
