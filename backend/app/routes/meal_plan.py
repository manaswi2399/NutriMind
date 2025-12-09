"""
Meal planning endpoints
"""

from fastapi import APIRouter, HTTPException
from app.models.request import MealPlanRequest, ChatRequest, NutritionAnalysisRequest
from app.models.response import MealPlanResponse, ChatResponse, NutritionAnalysisResponse, ErrorResponse
from app.services.ai_service import ai_service
from datetime import datetime, timedelta
import logging
import uuid

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/meal-plan", response_model=MealPlanResponse)
async def generate_meal_plan(request: MealPlanRequest):
    """
    Generate a personalized meal plan based on dietary preferences and restrictions
    """
    try:
        # Convert enums to strings
        dietary_restrictions = [dr.value for dr in request.dietary_restrictions]
        
        # Generate meal plan using AI
        plan_data = await ai_service.generate_meal_plan(
            dietary_restrictions=dietary_restrictions,
            calorie_target=request.calorie_target,
            meals_per_day=request.meals_per_day,
            days=request.days,
            allergies=request.allergies,
            preferences=request.preferences
        )
        
        # Process and format the response
        day_plans = []
        total_calories = 0
        
        for day_data in plan_data.get("days", []):
            day_number = day_data.get("day", 1)
            meals = []
            day_calories = 0
            
            for meal_data in day_data.get("meals", []):
                recipe_data = meal_data.get("recipe", {})
                
                # Generate unique ID for recipe
                recipe_id = str(uuid.uuid4())
                
                # Extract nutrition info
                nutrition_data = recipe_data.get("nutrition", {})
                nutrition = {
                    "calories": nutrition_data.get("calories", 0),
                    "protein": nutrition_data.get("protein", 0),
                    "carbohydrates": nutrition_data.get("carbohydrates", 0),
                    "fat": nutrition_data.get("fat", 0),
                    "fiber": nutrition_data.get("fiber", 0),
                    "sugar": nutrition_data.get("sugar", 0),
                    "sodium": nutrition_data.get("sodium", 0)
                }
                
                day_calories += nutrition["calories"]
                
                # Build recipe object
                recipe = {
                    "id": recipe_id,
                    "name": recipe_data.get("name", "Unknown Recipe"),
                    "description": recipe_data.get("description", ""),
                    "ingredients": recipe_data.get("ingredients", []),
                    "instructions": recipe_data.get("instructions", []),
                    "prep_time": recipe_data.get("prep_time", 0),
                    "cook_time": recipe_data.get("cook_time", 0),
                    "total_time": recipe_data.get("prep_time", 0) + recipe_data.get("cook_time", 0),
                    "servings": recipe_data.get("servings", 1),
                    "difficulty": recipe_data.get("difficulty", "medium"),
                    "cuisine": recipe_data.get("cuisine"),
                    "meal_type": meal_data.get("meal_type"),
                    "nutrition": nutrition,
                    "tags": recipe_data.get("tags", []),
                    "image_url": None  # Can be enhanced with image generation
                }
                
                meals.append({
                    "meal_type": meal_data.get("meal_type", "meal"),
                    "recipe": recipe
                })
            
            total_calories += day_calories
            
            # Calculate date for this day
            plan_date = (datetime.now() + timedelta(days=day_number - 1)).strftime("%Y-%m-%d")
            
            day_plans.append({
                "day": day_number,
                "date": plan_date,
                "meals": meals,
                "total_nutrition": {
                    "calories": day_calories,
                    "protein": sum(m["recipe"]["nutrition"]["protein"] for m in meals),
                    "carbohydrates": sum(m["recipe"]["nutrition"]["carbohydrates"] for m in meals),
                    "fat": sum(m["recipe"]["nutrition"]["fat"] for m in meals),
                    "fiber": sum(m["recipe"]["nutrition"]["fiber"] for m in meals),
                    "sugar": sum(m["recipe"]["nutrition"].get("sugar", 0) for m in meals),
                    "sodium": sum(m["recipe"]["nutrition"].get("sodium", 0) for m in meals)
                }
            })
        
        # Build summary
        summary = {
            "total_days": request.days,
            "meals_per_day": request.meals_per_day,
            "average_calories_per_day": total_calories // request.days if request.days > 0 else 0,
            "dietary_restrictions": dietary_restrictions,
            "calorie_target": request.calorie_target
        }
        
        return MealPlanResponse(
            success=True,
            plan=day_plans,
            summary=summary,
            generated_at=datetime.now()
        )
        
    except Exception as e:
        logger.error(f"Error generating meal plan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate meal plan: {str(e)}")

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """
    Chat with AI assistant about nutrition and recipes
    """
    try:
        response = await ai_service.chat(
            message=request.message,
            context=request.context
        )
        
        return ChatResponse(
            success=True,
            message=response["message"],
            suggestions=response.get("suggestions"),
            timestamp=datetime.now()
        )
        
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.post("/nutrition-analysis", response_model=NutritionAnalysisResponse)
async def analyze_nutrition(request: NutritionAnalysisRequest):
    """
    Analyze nutritional content of a recipe
    """
    try:
        analysis = await ai_service.analyze_nutrition(
            recipe_name=request.recipe_name,
            ingredients=request.ingredients,
            servings=request.servings
        )
        
        nutrition_per_serving = analysis["nutrition_per_serving"]
        
        # Calculate total nutrition
        nutrition_total = {
            key: value * request.servings 
            for key, value in nutrition_per_serving.items()
        }
        
        return NutritionAnalysisResponse(
            success=True,
            recipe_name=request.recipe_name,
            nutrition_per_serving=nutrition_per_serving,
            nutrition_total=nutrition_total,
            servings=request.servings,
            health_score=analysis["health_score"],
            recommendations=analysis["recommendations"]
        )
        
    except Exception as e:
        logger.error(f"Error analyzing nutrition: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Nutrition analysis failed: {str(e)}")
