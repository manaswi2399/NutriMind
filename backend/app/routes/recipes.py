"""
Recipe search and discovery endpoints
"""

from fastapi import APIRouter, HTTPException
from app.models.request import RecipeSearchRequest
from app.models.response import RecipeSearchResponse
from app.services.ai_service import ai_service
from datetime import datetime
import logging
import uuid

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/recipes/search", response_model=RecipeSearchResponse)
async def search_recipes(request: RecipeSearchRequest):
    """
    Search for recipes based on available ingredients
    """
    try:
        # Convert enums to strings
        dietary_restrictions = [dr.value for dr in request.dietary_restrictions]
        meal_type = request.meal_type.value if request.meal_type else None
        
        # Find recipes using AI
        recipes_data = await ai_service.find_recipes(
            ingredients=request.ingredients,
            dietary_restrictions=dietary_restrictions,
            meal_type=meal_type,
            cuisine=request.cuisine,
            cooking_time=request.cooking_time,
            servings=request.servings
        )
        
        # Process and format recipes
        recipes = []
        for recipe_data in recipes_data:
            # Generate unique ID
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
                "servings": recipe_data.get("servings", request.servings),
                "difficulty": recipe_data.get("difficulty", "medium"),
                "cuisine": recipe_data.get("cuisine", request.cuisine),
                "meal_type": recipe_data.get("meal_type", meal_type),
                "nutrition": nutrition,
                "tags": recipe_data.get("tags", []),
                "image_url": None  # Can be enhanced with image generation
            }
            
            recipes.append(recipe)
        
        # Build query info
        query_info = {
            "ingredients": request.ingredients,
            "dietary_restrictions": dietary_restrictions,
            "meal_type": meal_type,
            "cuisine": request.cuisine,
            "cooking_time": request.cooking_time,
            "servings": request.servings
        }
        
        return RecipeSearchResponse(
            success=True,
            recipes=recipes,
            total_count=len(recipes),
            query_info=query_info
        )
        
    except Exception as e:
        logger.error(f"Error searching recipes: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Recipe search failed: {str(e)}")

@router.get("/recipes/{recipe_id}")
async def get_recipe(recipe_id: str):
    """
    Get a specific recipe by ID
    Note: This is a placeholder. In production, implement proper database storage.
    """
    raise HTTPException(
        status_code=501,
        detail="Recipe retrieval by ID not yet implemented. Use search endpoint."
    )

@router.get("/recipes/trending")
async def get_trending_recipes():
    """
    Get trending recipes
    Note: This is a placeholder for future implementation
    """
    raise HTTPException(
        status_code=501,
        detail="Trending recipes feature coming soon!"
    )
