from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List
from ...core.config import supabase
from ..dependencies.get_user import get_current_user
from ...schemas.dish import Dish
from ...schemas.ingredient import Ingredient
from ...schemas.restaurant import Restaurant

# Create a new APIRouter instance
router = APIRouter()

def get_all_dishes(unique_dish_names, dishes_result, restaurant_id):

    dishes = []
    for dish_name_1 in unique_dish_names: 
        dish_ingredients = []
        dish_allergens = []
        for dish in dishes_result.data:
            if dish.get('name', []) == dish_name_1:
                dish_ingredients.append(dish.get('ingredient', []))

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
      
        dishes.append(Dish(
            name=dish_name_1,
            ingredients=dish_ingredients,
            allergens=dish_allergens,
            restaurant_id=restaurant_id
        ))
    
    return dishes


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
        
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User or restaurant not found")

        #restaurant_id = user_result.data["restaurant_id"]
        restaurant_id = user_result.data[0]['restaurant_id']

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
        
        dish_ingredients = []
        for dish in dishes_data:
            dish_ingredients.append(dish.get('ingredient', []))
        
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
    

@router.get("/all_dishes/", response_model=List[Dish])
def all_dishes(user=Depends(get_current_user)):
    """
    Retrieve all dishes for the authenticated user's restaurant.
    """
    try:
        # Get restaurant ID
        user_result = supabase.table("users")\
            .select("restaurant_id")\
            .eq("id", user.user.id)\
            .execute()
        
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User or restaurant not found")

        restaurant_id = user_result.data[0]['restaurant_id']

        # Fetch all dishes
        dishes_result = supabase.table("dishes")\
            .select("*")\
            .eq("restaurant_id", restaurant_id)\
            .execute()
        
        dishes_data = dishes_result.data
        if not dishes_data:
            return []
        
        unique_dish_names = set()
        for dish in dishes_result.data:
            dish_name = dish.get('name', [])
            if dish_name not in unique_dish_names:
                unique_dish_names.add(dish_name)
    
        dishes = get_all_dishes(unique_dish_names, dishes_result, restaurant_id)
        return dishes
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dishes_by_category/", response_model=List[Dish])
def get_dishes_by_category(category_name: str = Query(..., title="Category Name", description="The name of the category to filter dishes by"), user=Depends(get_current_user)):
    """
    Retrieve dishes for the authenticated user's restaurant filtered by category.
    """
    try:
        user_result = supabase.table("users")\
            .select("restaurant_id")\
            .eq("id", user.user.id)\
            .execute()

        if not user_result.data:
            raise HTTPException(status_code=404, detail="User or restaurant not found")

        restaurant_id = user_result.data[0]['restaurant_id']

        # Fetch dishes by category
        dishes_result = supabase.table("categories")\
            .select("*")\
            .eq("restaurant_id", restaurant_id)\
            .eq("category", category_name)\
            .execute()

        if not dishes_result.data:
            return []  # Or raise an exception if no dishes found as a business rule
        
        unique_dish_names = set()
        for dish in dishes_result.data:
            dish_name = dish.get('dish_name', [])
            if dish_name not in unique_dish_names:
                unique_dish_names.add(dish_name)

        # Fetch all dishes
        dishes_result_1 = supabase.table("dishes")\
            .select("*")\
            .eq("restaurant_id", restaurant_id)\
            .execute()

        dishes = get_all_dishes(unique_dish_names, dishes_result_1, restaurant_id)
        return dishes

    except HTTPException as http_exc:
        # If an HTTPException is raised, re-raise it
        raise http_exc
    
    except Exception as e:
        # Raise an HTTP 500 error if an exception occurs
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/categories/", response_model=List[str])
def get_categories(user=Depends(get_current_user)):
    """
    Retrieve all categories for the authenticated user's restaurant.
    """
    try:
        user_result = supabase.table("users")\
            .select("restaurant_id")\
            .eq("id", user.user.id)\
            .execute()

        if not user_result.data:
            raise HTTPException(status_code=404, detail="User or restaurant not found")

        restaurant_id = user_result.data[0]['restaurant_id']

        # Fetch all categories
        categories_result = supabase.table("categories")\
            .select("category")\
            .eq("restaurant_id", restaurant_id)\
            .execute()

        if not categories_result.data:
            return []  # Or raise an exception if no categories found as a business rule

        categories = []
        for category in categories_result.data:
            if category.get('category', []) not in categories:
                categories.append(category.get('category', []))

        return categories

    except HTTPException as http_exc:
        # If an HTTPException is raised, re-raise it
        raise http_exc
    
    except Exception as e:
        # Raise an HTTP 500 error if an exception occurs
        raise HTTPException(status_code=500, detail=str(e))