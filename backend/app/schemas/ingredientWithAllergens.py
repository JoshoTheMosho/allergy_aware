# schemas.py
from pydantic import BaseModel
from typing import List

class IngredientWithAllergens(BaseModel):
    """
    Represents an ingredient with its allergens.

    Attributes:
        ingredient (str): The name of the ingredient.
        allergens List[str]: A list of allergens associated with the ingredient.
    """
    ingredient: str
    allergens: List[str]
