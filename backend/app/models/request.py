"""
Request models for API endpoints
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional
from enum import Enum

class DietaryRestriction(str, Enum):
    """Supported dietary restrictions"""
    VEGETARIAN = "vegetarian"
    VEGAN = "vegan"
    GLUTEN_FREE = "gluten_free"
    DAIRY_FREE = "dairy_free"
    KETO = "keto"
    PALEO = "paleo"
    LOW_CARB = "low_carb"
    HIGH_PROTEIN = "high_protein"
    PESCATARIAN = "pescatarian"
    HALAL = "halal"
    KOSHER = "kosher"

class MealType(str, Enum):
    """Types of meals"""
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"

class MealPlanRequest(BaseModel):
    """Request model for meal plan generation"""
    
    dietary_restrictions: List[DietaryRestriction] = Field(
        default=[],
        description="List of dietary restrictions"
    )
    
    calorie_target: Optional[int] = Field(
        None,
        ge=800,
        le=5000,
        description="Target daily calories (800-5000)"
    )
    
    meals_per_day: int = Field(
        3,
        ge=1,
        le=6,
        description="Number of meals per day (1-6)"
    )
    
    days: int = Field(
        1,
        ge=1,
        le=7,
        description="Number of days to plan (1-7)"
    )
    
    allergies: List[str] = Field(
        default=[],
        description="List of food allergies"
    )
    
    preferences: Optional[str] = Field(
        None,
        max_length=500,
        description="Additional preferences or notes"
    )
    
    @validator('allergies')
    def validate_allergies(cls, v):
        if len(v) > 10:
            raise ValueError('Maximum 10 allergies allowed')
        return [allergy.strip().lower() for allergy in v]

class RecipeSearchRequest(BaseModel):
    """Request model for recipe search by ingredients"""
    
    ingredients: List[str] = Field(
        ...,
        min_items=1,
        max_items=20,
        description="List of available ingredients (1-20)"
    )
    
    dietary_restrictions: List[DietaryRestriction] = Field(
        default=[],
        description="List of dietary restrictions"
    )
    
    meal_type: Optional[MealType] = Field(
        None,
        description="Type of meal"
    )
    
    cuisine: Optional[str] = Field(
        None,
        max_length=50,
        description="Preferred cuisine type"
    )
    
    cooking_time: Optional[int] = Field(
        None,
        ge=5,
        le=240,
        description="Maximum cooking time in minutes (5-240)"
    )
    
    servings: int = Field(
        4,
        ge=1,
        le=12,
        description="Number of servings (1-12)"
    )
    
    @validator('ingredients')
    def validate_ingredients(cls, v):
        if not v:
            raise ValueError('At least one ingredient is required')
        return [ingredient.strip().lower() for ingredient in v if ingredient.strip()]

class ChatRequest(BaseModel):
    """Request model for AI chat interaction"""
    
    message: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="User message to AI assistant"
    )
    
    context: Optional[List[dict]] = Field(
        None,
        description="Previous conversation context"
    )

class NutritionAnalysisRequest(BaseModel):
    """Request model for nutritional analysis"""
    
    recipe_name: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Name of the recipe or meal"
    )
    
    ingredients: List[str] = Field(
        ...,
        min_items=1,
        description="List of ingredients with quantities"
    )
    
    servings: int = Field(
        1,
        ge=1,
        le=12,
        description="Number of servings"
    )
