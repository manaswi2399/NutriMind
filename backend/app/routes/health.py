"""
Health check endpoints
"""

from fastapi import APIRouter
from app.models.response import HealthCheckResponse
from datetime import datetime

router = APIRouter()

@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """Health check endpoint"""
    return HealthCheckResponse(
        status="healthy",
        version="1.0.0",
        timestamp=datetime.now(),
        services={
            "api": "operational",
            "claude_ai": "operational",
            "database": "not_implemented"
        }
    )
