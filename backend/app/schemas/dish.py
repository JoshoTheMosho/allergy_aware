from typing import List
from pydantic import BaseModel

class Dish(BaseModel):
    """
    Represents a dish with its name, ingredients, allergens, and associated restaurant ID.

    Attributes:
        name (str): The name of the dish.
        ingredients (List[str]): The list of ingredients of the dish.
        allergens (List[str]): The list of allergens associated with the dish.
        restaurant_id (int): The ID of the restaurant that offers the dish.
    """
    name: str
    ingredients: List[str]
    allergens: List[str]
    restaurant_id: int