from pydantic import BaseModel

class Ingredient(BaseModel):
    """
    Represents an ingredient with its name, associated restaurant ID, and allergen information.

    Attributes:
        name (str): The name of the ingredient.
        restaurant_id (int): The ID of the restaurant that uses the ingredient.
        allergen (str): The allergen information related to the ingredient.
    """
    name: str
    restaurant_id: int
    allergen: str