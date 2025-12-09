"""
Configuration settings for NutriMind backend
"""

from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    """Application settings"""
    
    # API Settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "NutriMind API"
    
    # Google Gemini API
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = "gemini-1.5-pro"  # or "gemini-1.5-flash" for faster responses
    MAX_TOKENS: int = 4096
    TEMPERATURE: float = 0.7
    
    # CORS Settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://nutrimind.netlify.app"
    ]
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Cache Settings
    CACHE_TTL: int = 3600  # 1 hour in seconds
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
