from fastapi import APIRouter, HTTPException, Body
from supabase import AuthApiError
from ...core.config import supabase
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/login/")
def login_user(email: str = Body(...), password: str = Body(...)):
    """
    Authenticate a user and return access and refresh tokens along with user details.

    Args:
        email (str): The email address of the user.
        password (str): The password of the user.

    Returns:
        dict: A dictionary containing the access token, refresh token, token type, expiration time, and user details.

    Raises:
        HTTPException: If authentication fails.
    """
    try:
        # Authenticate the user with Supabase
        response = supabase.auth.sign_in_with_password({"email": email, "password": password})

        return {
            "message": "Login successful",
            "response": response,
            "access_token": response.session.access_token
        }
    
    except AuthApiError as e:
        # If authentication fails, raise an HTTP 401 Unauthorized exception
        raise HTTPException(status_code=401, detail="Invalid email or password.") 
    except Exception as e:
        # For other unexpected errors, raise a 500 Internal Server Error
        logger.info(e)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")
    

