from fastapi import APIRouter
from .endpoints.allergens import router as allergens_router
from .endpoints.auth import router as auth_router  # Import auth router
from .endpoints.Image_OCR import router as image_ocr_router

# Create a new APIRouter instance
api_router = APIRouter()

# Include the allergens router with the prefix "/allergens" and tag "allergens"
api_router.include_router(allergens_router, prefix="/allergens", tags=["allergens"])

# Include the auth router with the prefix "/auth" and tag "Authentication"
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"]) 

api_router.include_router(image_ocr_router, prefix="/ocr", tags=["OCR"])
