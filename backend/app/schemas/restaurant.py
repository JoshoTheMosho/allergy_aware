from pydantic import BaseModel

class Restaurant(BaseModel):
    """
    Represents a restaurant with its ID and name.

    Attributes:
        restaurant_id (int): The unique identifier for the restaurant.
        restaurant_name (str): The name of the restaurant.
    """
    restaurant_id: int
    restaurant_name: str