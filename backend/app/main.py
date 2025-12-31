import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import rag, health, auth
from app.database import engine, Base
from app.models.user import User  # noqa: F401 - needed for table creation
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Startup validation - warn about missing optional env vars
def validate_environment():
    """Log warnings for missing environment variables."""
    warnings = []
    if not os.getenv("OPENAI_API_KEY"):
        warnings.append("OPENAI_API_KEY not set - AI responses will be limited")
    if not os.getenv("QDRANT_URL"):
        warnings.append("QDRANT_URL not set - using default localhost:6333")
    for w in warnings:
        print(f"WARNING: {w}")

validate_environment()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Physical AI Humanoid Robotics Book API",
    description="API for RAG-based chatbot and textbook content",
    version="1.0.0"
)

# CORS configuration - allow localhost and deployed frontend
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",") if os.getenv("ALLOWED_ORIGINS") else []
ALLOWED_ORIGINS.extend([
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
])
# Filter out empty strings
ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ALLOWED_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(rag.router, prefix="/api", tags=["rag"])
app.include_router(auth.router, prefix="/api", tags=["auth"])

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)