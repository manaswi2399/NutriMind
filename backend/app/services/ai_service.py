"""
AI Service for Fetch AI ASI-1 Mini (REST API version)
"""

import logging
import json
import requests
import asyncio
from typing import List, Dict, Optional
from app.config import settings
import re

logger = logging.getLogger(__name__)


class AIService:
    """Service for interacting with Fetch AI ASI models (REST API)"""

    def __init__(self):
        self.api_key = settings.FETCH_API_KEY
        self.model = settings.ASI_MODEL  # "asi1-mini"
        self.base_url = "https://api.asi1.ai/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        self.temperature = settings.TEMPERATURE

    async def _generate(self, prompt: str, temperature: float = None) -> str:
        """Wrapper for Fetch.ai REST chat completion"""

        payload = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": temperature if temperature else self.temperature,
            "max_tokens": settings.MAX_TOKENS
        }

        # Run blocking requests.post in async thread
        try:
            response = await asyncio.to_thread(
                requests.post,
                self.base_url,
                headers=self.headers,
                json=payload
            )

            data = response.json()

            return data["choices"][0]["message"]["content"]

        except Exception as e:
            logger.error(f"Fetch.ai API error: {str(e)}")
            raise

    # ---------------------------------------------------------
    # --------- MAIN FEATURE METHODS (meal-plan, recipes, chat)
    # ---------------------------------------------------------

    async def generate_meal_plan(
        self,
        dietary_restrictions: List[str],
        calorie_target: Optional[int],
        meals_per_day: int,
        days: int,
        allergies: List[str],
        preferences: Optional[str]
    ) -> Dict:

        prompt = self._build_meal_plan_prompt(
            dietary_restrictions,
            calorie_target,
            meals_per_day,
            days,
            allergies,
            preferences
        )

        response_text = await self._generate(prompt)
        return self._parse_meal_plan_response(response_text)

    async def find_recipes(
        self,
        ingredients: List[str],
        dietary_restrictions: List[str],
        meal_type: Optional[str],
        cuisine: Optional[str],
        cooking_time: Optional[int],
        servings: int
    ) -> List[Dict]:

        prompt = self._build_recipe_search_prompt(
            ingredients,
            dietary_restrictions,
            meal_type,
            cuisine,
            cooking_time,
            servings
        )

        response_text = await self._generate(prompt)
        return self._parse_recipe_response(response_text)

    async def chat(
        self,
        message: str,
        context: Optional[List[Dict]] = None
    ) -> Dict:

        # Build conversation
        messages = [{"role": "system", "content": """
You are NutriMind, a helpful AI nutritionist and recipe expert.
Provide meal planning advice, recipes, and nutrition guidance.
""" }]

        if context:
            messages.extend(context)

        messages.append({"role": "user", "content": message})

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": settings.MAX_TOKENS
        }

        response = await asyncio.to_thread(
            requests.post,
            self.base_url,
            headers=self.headers,
            json=payload
        )

        data = response.json()
        response_text = data["choices"][0]["message"]["content"]

        return {
            "message": response_text,
            "suggestions": self._extract_suggestions(response_text)
        }

    async def analyze_nutrition(
        self,
        recipe_name: str,
        ingredients: List[str],
        servings: int
    ) -> Dict:

        prompt = f"""Analyze the nutritional content of this recipe and return JSON only.

Recipe: {recipe_name}
Servings: {servings}

Ingredients:
{chr(10).join(f"- {i}" for i in ingredients)}

Required JSON Format:
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
  "health_score": <int>,
  "recommendations": [<strings>]
}}
"""

        response_text = await self._generate(prompt, temperature=0.3)

        json_start = response_text.find("{")
        json_end = response_text.rfind("}") + 1

        if json_start == -1 or json_end <= json_start:
            raise ValueError("Could not parse nutrition JSON")

        return json.loads(response_text[json_start:json_end])

    # ---------------------------------------------------------
    # ------------- PROMPT BUILDERS (unchanged)
    # ---------------------------------------------------------

    def _build_meal_plan_prompt(
        self,
        dietary_restrictions,
        calorie_target,
        meals_per_day,
        days,
        allergies,
        preferences
    ) -> str:

        prompt = f"""
    You are NutriMind, an expert meal-planning AI.

    Your ONLY task is to output **valid JSON**, with no explanations, no markdown, no text outside JSON.

    If you cannot satisfy a field, use a reasonable placeholder.

    STRICT RULES:
    - Respond with JSON ONLY
    - Do NOT include extra text
    - Do NOT include ```json``` or any formatting wrapper
    - Output must strictly follow this schema:

    {{
    "days": [
        {{
        "day": 1,
        "meals": [
            {{
            "meal_type": "breakfast",
            "recipe": {{
                "name": "string",
                "description": "string",
                "ingredients": ["string", ...],
                "instructions": ["string", ...],
                "prep_time": 0,
                "cook_time": 0,
                "nutrition": {{
                "calories": 0,
                "protein": 0,
                "carbohydrates": 0,
                "fat": 0,
                "fiber": 0,
                "sugar": 0,
                "sodium": 0
                }}
            }}
            }}
        ]
        }}
    ]
    }}

    USER INPUT:
    - Dietary restrictions: {', '.join(dietary_restrictions) or "None"}
    - Calorie target: {calorie_target or "None"}
    - Meals per day: {meals_per_day}
    - Days: {days}
    - Allergies: {', '.join(allergies) or "None"}
    - Preferences: {preferences or "None"}

    Return JSON ONLY.
    """

        return prompt


    def _build_recipe_search_prompt(
        self,
        ingredients,
        dietary_restrictions,
        meal_type,
        cuisine,
        cooking_time,
        servings
    ) -> str:

        prompt = f"""
    Find 3–5 recipes using these ingredients: {', '.join(ingredients)}

    Restrictions: {', '.join(dietary_restrictions) if dietary_restrictions else "None"}
    Meal type: {meal_type or "Any"}
    Cuisine: {cuisine or "Any"}
    Max cooking time: {cooking_time or "Any"} minutes
    Servings: {servings}

    ⚠️ VERY IMPORTANT RULES:
    - Return **JSON ONLY**, no explanations, no text outside JSON.
    - Nutrition values MUST be **pure numbers** (no units, no 'g', no 'mg').
    - Example: "protein": 18 not "18g".
    - Example: "sodium": 480 not "480mg".

    OUTPUT FORMAT:
    [
    {{
        "name": "...",
        "description": "...",
        "ingredients": ["..."],
        "instructions": ["..."],
        "prep_time": 0,
        "cook_time": 0,
        "total_time": 0,
        "servings": {servings},
        "difficulty": "easy",
        "cuisine": "{cuisine or ''}",
        "meal_type": "{meal_type or ''}",
        "nutrition": {{
        "calories": 0,
        "protein": 0,
        "carbohydrates": 0,
        "fat": 0,
        "fiber": 0,
        "sugar": 0,
        "sodium": 0
        }},
        "tags": [],
        "image_url": null
    }}
    ]
    """

        return prompt



    # ---------------------------------------------------------
    # ---------------- RESPONSE PARSERS
    # ---------------------------------------------------------

    def _parse_meal_plan_response(self, response_text: str) -> Dict:
        try:
            # Find first { 
            start = response_text.find("{")
            if start == -1:
                raise ValueError("No JSON object found")

            brace_count = 0
            end = start

            # Walk through the text counting { and }
            for i, ch in enumerate(response_text[start:], start=start):
                if ch == "{":
                    brace_count += 1
                elif ch == "}":
                    brace_count -= 1
                    if brace_count == 0:
                        end = i + 1
                        break

            if brace_count != 0:
                raise ValueError("JSON braces did not balance")

            json_text = response_text[start:end]
            return json.loads(json_text)

        except Exception as e:
            logger.error("Meal plan parsing failure. Raw response BELOW:")
            logger.error(response_text)
            raise ValueError("Meal plan JSON parsing failed.")



    def _parse_recipe_response(self, response_text: str) -> List[Dict]:
        try:
            json_start = response_text.find("[")
            if json_start == -1:
                json_start = response_text.find("{")
            json_end = response_text.rfind("]") + 1
            if json_end == 0:
                json_end = response_text.rfind("}") + 1

            data = json.loads(response_text[json_start:json_end])
            return data if isinstance(data, list) else [data]

        except Exception:
            raise ValueError("Recipe JSON parsing failed.")

    def _extract_suggestions(self, response_text: str) -> List[str]:
        text = response_text.lower()
        suggestions = []
        if "recipe" in text:
            suggestions.append("Show me similar recipes")
        if "nutrition" in text:
            suggestions.append("Analyze nutritional content")
        if "you could" in text:
            suggestions.append("Tell me healthy alternatives")
        return suggestions[:3]


# Singleton instance
ai_service = AIService()
