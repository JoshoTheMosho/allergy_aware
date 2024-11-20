from fastapi import HTTPException, Depends, Header
from ...core.config import supabase
from fastapi.security import OAuth2PasswordBearer

# Define the OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login/")

def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Retrieve the current authenticated user based on the provided token.

    Args:
        token (str): The authentication token provided by the user.

    Returns:
        user: The authenticated user object.

    Raises:
        HTTPException: If the user is not authenticated or the token is invalid.
    """
    # Retrieve the user from Supabase using the provided token
    user = supabase.auth.get_user(token)

    # If the user is not found, raise an HTTP 401 Unauthorized exception
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # Return the authenticated user
    return user
