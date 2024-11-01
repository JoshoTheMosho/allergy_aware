from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List
from ...core.config import supabase
from ..dependencies.get_user import get_current_user
from ...schemas.dish import Dish
from ...schemas.ingredient import Ingredient
from ...schemas.restaurant import Restaurant

# Create a new APIRouter instance
router = APIRouter()

@router.get("/search/", response_model=Dish)
def search_ingredients(query: str = Query(..., title="Query", description="Search by dish name"), user=Depends(get_current_user)):
    """
    Search for dishes based on dish name.

    Args:
        query (str): The search query string. This parameter is used to search for dishes by allergen or ingredient.
        user: The current authenticated user. This parameter is automatically injected by FastAPI using the get_current_user dependency.

    Returns:
        List[Dish]: A list of dishes that match the search query.

    Raises:
        HTTPException: If an error occurs while processing the request.
    """
    try:

        # Step 1: Query the "user" table to get the associated restaurant_id for the current user
        user_result = supabase.table("users")\
            .select("restaurant_id")\
            .eq("id", user.user.id)\
            .execute()

        print("User Result:", user_result.data)

        #restaurant_id = user_result.data["restaurant_id"]
        restaurant_id = user_result.data[0]['restaurant_id']

        print("Restaurant ID:", restaurant_id)

        # Step 2: Query the dishes table based on the queried dish name
        dishes_result = supabase.table("dishes")\
            .select("*")\
            .ilike("name", f"%{query}%")\
            .eq("restaurant_id", restaurant_id)\
            .execute()

         # Extract the list of ingredients found
        dishes_data = dishes_result.data
        if not dishes_data:
            return []

        print("dishes Data:", dishes_data)
        
        dish_ingredients = []
        for dish in dishes_data:
            dish_ingredients.append(dish.get('ingredient', []))
        
        print("Ingredients:", dish_ingredients)

        # Step 3: Query the ingredients table to get the list of allergens associated with the dish
        dish_allergens = []
        for ingredient in dish_ingredients:
            allergens_result = supabase.table("ingredients")\
                .select("*")\
                .ilike("name", f"%{ingredient}%")\
                .eq("restaurant_id", restaurant_id)\
                .execute()
            
            allergens_data = allergens_result.data
            if not allergens_data:
                continue

            for allergen in allergens_data:
                if (allergen.get('allergen', []) not in dish_allergens) and (allergen.get('allergen', []) != "Unknown"): 
                    dish_allergens.append(allergen.get('allergen', []))

        print("Allergens:", dish_allergens)

        # Step 4: Return the list of dishes that match the search query
        return Dish(
            name=query,
            ingredients=dish_ingredients,
            allergens=dish_allergens,
            restaurant_id=restaurant_id
        ) 

    
    except HTTPException as http_exc:
        # If an HTTPException is raised, re-raise it
        raise http_exc
    
    except Exception as e:
        # Raise an HTTP 500 error if an exception occurs
        raise HTTPException(status_code=500, detail=str(e))