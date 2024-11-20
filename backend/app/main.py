import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.router import api_router
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a new FastAPI instance with a custom title
app = FastAPI(title="Allergy Management App")

# Log environment variables
environment = os.getenv("ENVIRONMENT")
frontend_url = os.getenv("FRONTEND_URL", default="http://localhost:5173")

logger.info(f"ENVIRONMENT variable: {environment}")
logger.info(f"FRONTEND_URL variable: {frontend_url}")

# Set up the environment variable for development
is_development = os.getenv("ENVIRONMENT") == "development"

if is_development:
    logger.info("Development mode active. Allowing all origins.")
    frontend_url = "*"
else:
    logger.info(f"Production mode. Allowing frontend URL: {frontend_url}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],  # Allow your frontend URL only
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Include the API router to handle all the routes defined in the api_router
app.include_router(api_router)
