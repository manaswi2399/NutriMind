"""
AI Service for Gemini API integration
Handles all interactions with Google Gemini AI
"""

import google.generativeai as genai
import logging
import json
from typing import List, Dict, Optional
from app.config import settings

logger = logging.getLogger(__name__)

class AIService:
    """Service for interacting with Google Gemini AI"""
    
    def __init__(self):
        """Initialize Gemini client"""
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
        self.temperature = settings.TEMPERATURE
    
    async def generate_meal_plan(
        self,
        dietary_restrictions: List[str],
        calorie_target: Optional[int],
        meals_per_day: int,
        days: int,
        allergies: List[str],
        preferences: Optional[str]
    ) -> Dict:
        """Generate a personalized meal plan using Gemini AI"""
        
        # Construct the prompt
        prompt = self._build_meal_plan_prompt(
            dietary_restrictions,
            calorie_target,
            meals_per_day,
            days,
            allergies,
            preferences
        )
        
        try:
            # Call Gemini API
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=self.temperature,
                    max_output_tokens=settings.MAX_TOKENS,
                )
            )
            
            # Parse response
            response_text = response.text
            meal_plan = self._parse_meal_plan_response(response_text)
            
            logger.info(f"Successfully generated meal plan for {days} days")
            return meal_plan
            
        except Exception as e:
            logger.error(f"Error generating meal plan: {str(e)}")
            raise
    
    async def find_recipes(
        self,
        ingredients: List[str],
        dietary_restrictions: List[str],
        meal_type: Optional[str],
        cuisine: Optional[str],
        cooking_time: Optional[int],
        servings: int
    ) -> List[Dict]:
        """Find recipes based on available ingredients"""
        
        # Construct the prompt
        prompt = self._build_recipe_search_prompt(
            ingredients,
            dietary_restrictions,
            meal_type,
            cuisine,
            cooking_time,
            servings
        )
        
        try:
            # Call Gemini API
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=self.temperature,
                    max_output_tokens=settings.MAX_TOKENS,
                )
            )
            
            # Parse response
            response_text = response.text
            recipes = self._parse_recipe_response(response_text)
            
            logger.info(f"Successfully found {len(recipes)} recipes")
            return recipes
            
        except Exception as e:
            logger.error(f"Error finding recipes: {str(e)}")
            raise
    
    async def chat(
        self,
        message: str,
        context: Optional[List[Dict]] = None
    ) -> Dict:
        """Handle conversational chat about nutrition and recipes"""
        
        # Build conversation history
        conversation_text = ""
        if context:
            for msg in context:
                role = msg.get("role", "user")
                content = msg.get("content", "")
                conversation_text += f"{role}: {content}\n"
        
        conversation_text += f"user: {message}"
        
        system_instruction = """You are NutriMind, a helpful AI nutritionist and recipe expert. 
Provide personalized meal planning advice, recipe suggestions, and nutritional guidance. 
Be friendly, encouraging, and focus on healthy, sustainable eating habits."""
        
        full_prompt = f"{system_instruction}\n\n{conversation_text}\n\nassistant:"
        
        try:
            # Call Gemini API
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=2048,
                )
            )
            
            response_text = response.text
            
            logger.info("Successfully processed chat message")
            return {
                "message": response_text,
                "suggestions": self._extract_suggestions(response_text)
            }
            
        except Exception as e:
            logger.error(f"Error in chat: {str(e)}")
            raise
    
    async def analyze_nutrition(
        self,
        recipe_name: str,
        ingredients: List[str],
        servings: int
    ) -> Dict:
        """Analyze nutritional content of a recipe"""
        
        prompt = f"""Analyze the nutritional content of this recipe and provide detailed information.

Recipe: {recipe_name}
Servings: {servings}
Ingredients:
{chr(10).join(f"- {ing}" for ing in ingredients)}

Please provide:
1. Nutritional information per serving (calories, protein, carbs, fat, fiber, sugar, sodium)
2. Total nutritional information for all servings
3. Health score (0-100) based on nutritional balance
4. Health recommendations and tips

Return your response in JSON format with the following structure:
{{
    "nutrition_per_serving": {{
        "calories": <int>,
        "protein": <float>,
        "carbohydrates": <float>,
        "fat": <float>,
        "fiber": <float>,
        "sugar": <float>,
        "sodium": <float>
    }},
    "health_score": <int 0-100>,
    "recommendations": [<list of strings>]
}}"""
        
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.3,
                    max_output_tokens=2048,
                )
            )
            
            response_text = response.text
            
            # Extract JSON from response
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            if json_start != -1 and json_end > json_start:
                json_str = response_text[json_start:json_end]
                analysis = json.loads(json_str)
            else:
                raise ValueError("Could not parse JSON from response")
            
            logger.info(f"Successfully analyzed nutrition for {recipe_name}")
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing nutrition: {str(e)}")
            raise
    
    def _build_meal_plan_prompt(
        self,
        dietary_restrictions: List[str],
        calorie_target: Optional[int],
        meals_per_day: int,
        days: int,
        allergies: List[str],
        preferences: Optional[str]
    ) -> str:
        """Build prompt for meal plan generation"""
        
        prompt = f"""Create a detailed {days}-day meal plan with {meals_per_day} meals per day.

Requirements:
"""
        
        if dietary_restrictions:
            prompt += f"- Dietary restrictions: {', '.join(dietary_restrictions)}\n"
        
        if calorie_target:
            prompt += f"- Target calories per day: {calorie_target}\n"
        
        if allergies:
            prompt += f"- Allergies to avoid: {', '.join(allergies)}\n"
        
        if preferences:
            prompt += f"- Additional preferences: {preferences}\n"
        
        prompt += """
For each meal, provide:
1. Meal name
2. Brief description
3. Complete ingredient list with quantities
4. Step-by-step cooking instructions
5. Prep time, cook time, and total time
6. Servings
7. Difficulty level (easy/medium/hard)
8. Nutritional information (calories, protein, carbs, fat, fiber)
9. Cuisine type and meal tags

Return the response in JSON format with the following structure:
{
    "days": [
        {
            "day": 1,
            "meals": [
                {
                    "meal_type": "breakfast",
                    "recipe": {
                        "name": "...",
                        "description": "...",
                        "ingredients": ["..."],
                        "instructions": ["..."],
                        "prep_time": 10,
                        "cook_time": 15,
                        "servings": 2,
                        "difficulty": "easy",
                        "cuisine": "...",
                        "nutrition": {
                            "calories": 350,
                            "protein": 15,
                            "carbohydrates": 45,
                            "fat": 12,
                            "fiber": 6
                        },
                        "tags": ["healthy", "quick"]
                    }
                }
            ]
        }
    ]
}

Make the recipes delicious, balanced, and varied across days."""
        
        return prompt
    
    def _build_recipe_search_prompt(
        self,
        ingredients: List[str],
        dietary_restrictions: List[str],
        meal_type: Optional[str],
        cuisine: Optional[str],
        cooking_time: Optional[int],
        servings: int
    ) -> str:
        """Build prompt for recipe search"""
        
        prompt = f"""Find 3-5 delicious recipes that can be made with these ingredients:
{', '.join(ingredients)}

Requirements:
- Servings: {servings}
"""
        
        if dietary_restrictions:
            prompt += f"- Dietary restrictions: {', '.join(dietary_restrictions)}\n"
        
        if meal_type:
            prompt += f"- Meal type: {meal_type}\n"
        
        if cuisine:
            prompt += f"- Preferred cuisine: {cuisine}\n"
        
        if cooking_time:
            prompt += f"- Maximum cooking time: {cooking_time} minutes\n"
        
        prompt += """
For each recipe, provide:
1. Recipe name
2. Brief description
3. Complete ingredient list with quantities
4. Step-by-step instructions
5. Prep time, cook time, and total time
6. Difficulty level
7. Nutritional information
8. Tags and cuisine type

Return the response in JSON format as an array of recipes with the same structure as in the meal plan example.
Focus on recipes that maximize the use of the provided ingredients."""
        
        return prompt
    
    def _parse_meal_plan_response(self, response_text: str) -> Dict:
        """Parse Claude's meal plan response"""
        try:
            # Extract JSON from response
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                json_str = response_text[json_start:json_end]
                meal_plan = json.loads(json_str)
                return meal_plan
            else:
                raise ValueError("Could not find JSON in response")
                
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing JSON: {str(e)}")
            raise ValueError(f"Invalid JSON response: {str(e)}")
    
    def _parse_recipe_response(self, response_text: str) -> List[Dict]:
        """Parse Claude's recipe search response"""
        try:
            # Extract JSON from response
            json_start = response_text.find('[')
            if json_start == -1:
                json_start = response_text.find('{')
            
            json_end = response_text.rfind(']') + 1
            if json_end == 0:
                json_end = response_text.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                json_str = response_text[json_start:json_end]
                recipes = json.loads(json_str)
                
                # Ensure it's a list
                if isinstance(recipes, dict):
                    recipes = [recipes]
                
                return recipes
            else:
                raise ValueError("Could not find JSON in response")
                
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing JSON: {str(e)}")
            raise ValueError(f"Invalid JSON response: {str(e)}")
    
    def _extract_suggestions(self, response_text: str) -> List[str]:
        """Extract follow-up suggestions from response"""
        # Simple heuristic to extract suggestions
        suggestions = []
        
        if "you could" in response_text.lower():
            suggestions.append("Tell me more about healthy alternatives")
        
        if "recipe" in response_text.lower():
            suggestions.append("Show me similar recipes")
        
        if "calorie" in response_text.lower() or "nutrition" in response_text.lower():
            suggestions.append("Analyze the nutritional content")
        
        return suggestions[:3]  # Return max 3 suggestions

# Create singleton instance
ai_service = AIService()
