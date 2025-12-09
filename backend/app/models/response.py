"""
Response models for API endpoints
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class NutritionInfo(BaseModel):
    """Nutritional information model"""
    calories: int = Field(..., description="Calories per serving")
    protein: float = Field(..., description="Protein in grams")
    carbohydrates: float = Field(..., description="Carbohydrates in grams")
    fat: float = Field(..., description="Fat in grams")
    fiber: Optional[float] = Field(None, description="Fiber in grams")
    sugar: Optional[float] = Field(None, description="Sugar in grams")
    sodium: Optional[float] = Field(None, description="Sodium in mg")

class Recipe(BaseModel):
    """Recipe model"""
    id: str = Field(..., description="Unique recipe identifier")
    name: str = Field(..., description="Recipe name")
    description: str = Field(..., description="Recipe description")
    ingredients: List[str] = Field(..., description="List of ingredients")
    instructions: List[str] = Field(..., description="Cooking instructions")
    prep_time: int = Field(..., description="Preparation time in minutes")
    cook_time: int = Field(..., description="Cooking time in minutes")
    total_time: int = Field(..., description="Total time in minutes")
    servings: int = Field(..., description="Number of servings")
    difficulty: str = Field(..., description="Difficulty level: easy, medium, hard")
    cuisine: Optional[str] = Field(None, description="Cuisine type")
    meal_type: Optional[str] = Field(None, description="Meal type")
    nutrition: NutritionInfo = Field(..., description="Nutritional information")
    tags: List[str] = Field(default=[], description="Recipe tags")
    image_url: Optional[str] = Field(None, description="Recipe image URL")

class Meal(BaseModel):
    """Meal model for meal plans"""
    meal_type: str = Field(..., description="Type of meal")
    recipe: Recipe = Field(..., description="Recipe for this meal")

class DayPlan(BaseModel):
    """Daily meal plan"""
    day: int = Field(..., description="Day number")
    date: Optional[str] = Field(None, description="Date for this day")
    meals: List[Meal] = Field(..., description="Meals for this day")
    total_nutrition: NutritionInfo = Field(..., description="Total nutrition for the day")

class MealPlanResponse(BaseModel):
    """Response model for meal plan generation"""
    success: bool = Field(..., description="Success status")
    plan: List[DayPlan] = Field(..., description="Meal plan for requested days")
    summary: Dict[str, Any] = Field(..., description="Plan summary")
    generated_at: datetime = Field(default_factory=datetime.now, description="Generation timestamp")

class RecipeSearchResponse(BaseModel):
    """Response model for recipe search"""
    success: bool = Field(..., description="Success status")
    recipes: List[Recipe] = Field(..., description="List of matching recipes")
    total_count: int = Field(..., description="Total number of recipes found")
    query_info: Dict[str, Any] = Field(..., description="Information about the query")

class ChatResponse(BaseModel):
    """Response model for AI chat"""
    success: bool = Field(..., description="Success status")
    message: str = Field(..., description="AI assistant response")
    suggestions: Optional[List[str]] = Field(None, description="Follow-up suggestions")
    timestamp: datetime = Field(default_factory=datetime.now, description="Response timestamp")

class NutritionAnalysisResponse(BaseModel):
    """Response model for nutrition analysis"""
    success: bool = Field(..., description="Success status")
    recipe_name: str = Field(..., description="Name of analyzed recipe")
    nutrition_per_serving: NutritionInfo = Field(..., description="Nutrition per serving")
    nutrition_total: NutritionInfo = Field(..., description="Total nutrition")
    servings: int = Field(..., description="Number of servings")
    health_score: int = Field(..., description="Health score (0-100)")
    recommendations: List[str] = Field(..., description="Health recommendations")

class HealthCheckResponse(BaseModel):
    """Response model for health check"""
    status: str = Field(..., description="Service status")
    version: str = Field(..., description="API version")
    timestamp: datetime = Field(default_factory=datetime.now, description="Check timestamp")
    services: Dict[str, str] = Field(..., description="Status of dependent services")

class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = Field(default=False, description="Success status")
    error: str = Field(..., description="Error message")
    error_code: Optional[str] = Field(None, description="Error code")
    timestamp: datetime = Field(default_factory=datetime.now, description="Error timestamp")