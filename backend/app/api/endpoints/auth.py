from fastapi import APIRouter, HTTPException, Body
from supabase import AuthApiError
from ...core.config import supabase
import logging
from pydantic import BaseModel

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
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
        }
    
    except AuthApiError as e:
        # If authentication fails, raise an HTTP 401 Unauthorized exception
        raise HTTPException(status_code=401, detail="Invalid email or password.") 
    except Exception as e:
        # For other unexpected errors, raise a 500 Internal Server Error
        logger.info(e)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")
    
@router.post("/refresh/")
def refresh_token():
    """
    Refresh an access token using a refresh token.

    Args:
        refresh_token (str): The refresh token provided by the user.

    Returns:
        dict: A dictionary containing the new access token and refresh token.
    """
    try:
        response = supabase.auth.refresh_session()
        print("refresh successful")
        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "expires_in": response.session.expires_in
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to refresh token.")

@router.post("/reset/")
def reset_password(email: str = Body(..., embed=True)):
    """
    Reset the user's password by sending a reset email.

    Args:
        email (str): The email address of the user requesting a password reset.

    Returns:
        dict: A dictionary indicating the success of the password reset request.

    Raises:
        HTTPException: If the email is invalid or an error occurs during the reset request.
    """
    try:
        # Request a password reset email to be sent
        response = supabase.auth.reset_password_for_email(email)
        
        # Response to indicate success if no exception is raised
        return {"message": "Password reset email sent successfully."}

    except AuthApiError as e:
        # Handle known Supabase authentication errors
        raise HTTPException(status_code=400, detail="Invalid email or user not found.")
    
    except Exception as e:
        # Log unexpected errors and raise an HTTP 500 exception
        logger.info(e)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")


@router.post("/signup/")
def signup_user(email: str = Body(...), password: str = Body(...), restaurantName: str = Body(...)):
    """
    Create a new user in the system and a corresponding restaurant.

    Args:
        email (str): The email address of the user signing up.
        password (str): The password for the new user.

    Returns:
        dict: A dictionary indicating the success of the signup request and restaurant creation.

    Raises:
        HTTPException: If signup or restaurant creation fails.
    """
    try:
        # Step 1: Sign up the user
        response = supabase.auth.sign_up({"email": email, "password": password})
        
        # Check if the user was successfully created
        if not response or not response.user:
            raise HTTPException(status_code=400, detail="Signup failed. Please try again.")
        
        user_id = response.user.id  # Supabase user ID
        
        # Step 2: Create a new restaurant for the user
        restaurant_response = supabase.table("Restaurants").insert({
            "restaurant_name": restaurantName
        }).execute()

        if not restaurant_response.data:
            raise HTTPException(status_code=500, detail="Failed to create restaurant for the user.")
        
        restaurant_id = restaurant_response.data[0]['restaurant_id']

        user_response = supabase.table("users").insert({
            "id": user_id,
            "restaurant_id": restaurant_id
        }).execute()

        if not restaurant_response.data:
            raise HTTPException(status_code=500, detail="Failed to create user association to restaurant.")

        # Step 3: Return success response
        return {
            "message": "Signup successful.",
            "session": response.session,
        }

    except AuthApiError as e:
        # Handle known Supabase authentication errors
        raise HTTPException(status_code=400, detail=str(e))
    
    except Exception as e:
        # Log unexpected errors and raise an HTTP 500 exception
        logger.error(f"Unexpected error during signup: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")
