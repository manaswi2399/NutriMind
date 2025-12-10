import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import Hero from './components/Hero';
import DietForm from './components/DietForm';
import IngredientForm from './components/IngredientForm';
import RecipeCards from './components/RecipeCards';
import Navigation from './components/Navigation';

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
  const [activeView, setActiveView] = useState<'home' | 'diet' | 'ingredients'>('home');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

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

      setRecipes(recipes);

    } catch (error) {
      console.error("Error fetching meal plan:", error);
    } finally {
      setLoading(false);
    }
  };



  const handleIngredientSubmit = async (ingredientData: any) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/recipes/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ingredientData),
      });
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
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
            {recipes.length > 0 && <RecipeCards recipes={recipes} />}
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
                setRecipes={setRecipes}
                loading={loading}
                setLoading={setLoading}
            />
            {recipes.length > 0 && <RecipeCards recipes={recipes} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
