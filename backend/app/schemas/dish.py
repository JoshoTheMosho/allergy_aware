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

def sort_dishes_by_name(dishes: List[Dish]) -> List[Dish]:
    """
    Sorts a list of Dish objects by their name in alphabetical order.

    Args:
        dishes (List[Dish]): The list of Dish objects to sort.

    Returns:
        List[Dish]: The sorted list of Dish objects.
    """
    return sorted(dishes, key=lambda dish: dish.name.lower())  # Case-insensitive sorting

