import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import './styles/light-mode-overrides.css';
import Hero from './components/Hero';
import DietForm from './components/DietForm';
import IngredientForm from './components/IngredientForm';
import RecipeCards from './components/RecipeCards';
import Navigation from './components/Navigation';
import FavoritesPage from './components/FavoritesPage';
import { useThemeMode } from "./context/ThemeContext";

export interface Recipe {
  id: string;
  name: string;
  description: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  ingredients?: string[];
  instructions?: string[];
  image?: string;
  cookTime?: string;
  servings?: number;
}

function App() {
  const { mode } = useThemeMode();
  const [activeView, setActiveView] = useState<'home' | 'diet' | 'ingredients' | 'favorites'>('home');
  
  // Separate recipe states for each page (from your App.tsx)
  const [dietRecipes, setDietRecipes] = useState<Recipe[]>([]);
  const [ingredientRecipes, setIngredientRecipes] = useState<Recipe[]>([]);
  
  const [loading, setLoading] = useState(false);
  
  // Favorites functionality (from App_fav.tsx)
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = (recipe: Recipe) => {
    const exists = favorites.some((fav) => fav.id === recipe.id);

    if (exists) {
      // Remove from favorites
      setFavorites(favorites.filter((fav) => fav.id !== recipe.id));
    } else {
      // Add to favorites
      setFavorites([...favorites, recipe]);
    }
  };

  const handleDietSubmit = async (dietData: any) => {
    setLoading(true);
    try {
      // 1️⃣  Convert dietType UI field to enum value
      const dietEnumMap: Record<string, string> = {
        "balanced": "",
        "low-carb": "low_carb",
        "high-protein": "high_protein",
        "vegetarian": "vegetarian",
        "vegan": "vegan",
        "keto": "keto",
        "paleo": "paleo",
        "mediterranean": "" // backend does NOT have this enum
      };

      const mappedDietRestriction = dietEnumMap[dietData.dietType]
        ? [dietEnumMap[dietData.dietType]]
        : [];

      // 2️⃣  Convert restrictions (like "no nuts") to allergies[]:
      const allergies = dietData.restrictions
        ? dietData.restrictions
            .split(",")
            .map((r: string) => r.trim().toLowerCase())
            .filter(Boolean)
        : [];

      // 3️⃣ Build backend-safe payload
      const payload = {
        dietary_restrictions: mappedDietRestriction,  
        calorie_target: Number(dietData.calories),
        meals_per_day: Number(dietData.meals),
        days: 5,
        allergies: allergies,
        preferences: dietData.protein // optional
      };

      console.log("Sending payload:", payload);

      const response = await fetch("http://localhost:8000/api/meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("API Error:", error);
        alert("Meal plan request failed. See console.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("API response:", data);

      const recipes = data.plan.flatMap((day: any) =>
        day.meals.map((m: any) => ({
          id: m.recipe.id,
          name: m.recipe.name,
          description: m.recipe.description,
          calories: m.recipe.nutrition.calories,
          protein: m.recipe.nutrition.protein,
          carbs: m.recipe.nutrition.carbohydrates,
          fat: m.recipe.nutrition.fat,
          ingredients: m.recipe.ingredients,
          instructions: m.recipe.instructions,
        }))
      );

      setDietRecipes(recipes); // Store in diet-specific state

    } catch (error) {
      console.error("Error fetching meal plan:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={`app app-${mode}`}>
    <Navigation activeView={activeView} setActiveView={setActiveView} />
      
      <AnimatePresence mode="wait">
        {activeView === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Hero setActiveView={setActiveView} />
          </motion.div>
        )}

        {activeView === 'diet' && (
          <motion.div
            key="diet"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <DietForm onSubmit={handleDietSubmit} loading={loading} />
            {dietRecipes.length > 0 && (
              <RecipeCards 
                recipes={dietRecipes}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onSelectRecipe={setSelectedRecipe}
              />
            )}
          </motion.div>
        )}

        {activeView === 'ingredients' && (
          <motion.div
            key="ingredients"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <IngredientForm 
              setRecipes={setIngredientRecipes}
              loading={loading}
              setLoading={setLoading}
            />
            {ingredientRecipes.length > 0 && (
              <RecipeCards 
                recipes={ingredientRecipes}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onSelectRecipe={setSelectedRecipe}
              />
            )}
          </motion.div>
        )}

        {activeView === 'favorites' && (
          <motion.div
            key="favorites"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <FavoritesPage 
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSelectRecipe={setSelectedRecipe}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;