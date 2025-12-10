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
    
    # Fetch.ai ASI API
    FETCH_API_KEY: str = ""                        # Your Fetch.ai key from .env
    ASI_MODEL: str = "asi1-mini"                   # Default model
    MAX_TOKENS: int = 32000
    TEMPERATURE: float = 0.7

    # CORS Settings
    ALLOWED_ORIGINS: str = (
        "http://localhost:5173,http://localhost:3000,http://localhost:3002,"
        "http://127.0.0.1:5173,http://127.0.0.1:3000,http://127.0.0.1:3002,"
        "https://nutrimind.netlify.app"
    )
    
    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Cache Settings
    CACHE_TTL: int = 3600
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    def get_allowed_origins(self) -> List[str]:
        """Parse ALLOWED_ORIGINS string to list"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(',')]

settings = Settings()
