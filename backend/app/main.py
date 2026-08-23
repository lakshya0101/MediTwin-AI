import logging
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Load environment variables before anything else
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.api.routes import ai

# Configure basic logging for the application
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    """
    logger.info("Starting up MediTwin AI Backend...")
    # Any startup logic (e.g., database connections) goes here
    
    yield  # Application is running
    
    logger.info("Shutting down MediTwin AI Backend...")
    # Any shutdown logic (e.g., closing connections) goes here

# Initialize FastAPI application with production-ready settings
app = FastAPI(
    title="MediTwin AI Backend API",
    description="The core backend and AI simulation engine for the MediTwin Digital Health Twin.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Configure CORS (Cross-Origin Resource Sharing) for the frontend
# In production, replace ["*"] with the specific origins (e.g., ["https://meditwin.app"])
origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
# The AI router already has a prefix internally, but we override it here for API versioning
app.include_router(ai.router, prefix="/api/v1")

@app.get("/health", tags=["System"])
async def health_check():
    """
    Basic health check endpoint to verify the API is running.
    """
    return JSONResponse(content={"status": "healthy", "service": "MediTwin AI Backend"})

@app.get("/", include_in_schema=False)
async def root():
    """
    Root redirect or simple message.
    """
    return {"message": "Welcome to the MediTwin AI API. Visit /docs for documentation."}
