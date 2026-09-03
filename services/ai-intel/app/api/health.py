from fastapi import APIRouter
from app.config import settings

router = APIRouter()

@router.get('/health')
async def health_check():
    return {
        "status": "healthy",
        "service": "neruma-ai-intel",
        "environment": settings.environment
    }

@router.get('/ready')
async def readiness_check():
    return {
        "status": "ready",
        "llm_provider": "gemini",
        "default_model": settings.default_llm_model,
        "queue_configured": bool(settings.valkey_url)
    }
