from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.health import router as health_router
from app.api.products import router as products_router
from app.config import settings

app = FastAPI(
    title="Neruma AI Product Intelligence Layer",
    description="Motor assíncrono de enriquecimento de catálogo, SEO, copywriting e marketing multicanal.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(products_router)

@app.get("/")
async def root():
    return {
        "service": "neruma-ai-intel",
        "docs": "/docs",
        "version": "1.0.0"
    }
