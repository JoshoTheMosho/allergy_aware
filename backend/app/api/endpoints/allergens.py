from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List

from ...core.config import supabase
from ..dependencies.get_user import get_current_user
from ...schemas.dish import Dish
from ...schemas.ingredient import Ingredient
from ...schemas.restaurant import Restaurant
from ...schemas.ingredientWithAllergens import IngredientWithAllergens
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
    logger.info("Search Query: %s", query)

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

@router.get("/ingredientsData", response_model=List[dict])
def get_ingredients_data(user=Depends(get_current_user)):
    """
    Returns a list of ingredients with their associated allergens.
    """
    logger.info("Fetching ingredients with allergens for user: %s", user.user.id)

    try:
        # Step 1: Query the "user" table to get the associated restaurant_id for the current user
        user_result = supabase.table("users")\
            .select("restaurant_id")\
            .eq("id", user.user.id)\
            .execute()
        
        logger.info("User Result: %s", user_result.data)

        if not user_result.data:
            logger.error("No restaurant associated with this user.")
            raise HTTPException(status_code=404, detail="User has no associated restaurant.")

        restaurant_id = user_result.data[0]['restaurant_id']
        
        # Step 2: Query the "ingredients" table for ingredients with allergens for the restaurant_id
        ingredients_allergens_result = supabase.table("ingredients")\
            .select("name, allergen")\
            .eq("restaurant_id", restaurant_id)\
            .execute()

        logger.info("Ingredients Allergens Result: %s", ingredients_allergens_result.data)

        if not ingredients_allergens_result.data:
            return []

        # Step 3: Organize the data into a dictionary with ingredients as keys and lists of allergens as values
        ingredients_allergens = {}
        for row in ingredients_allergens_result.data:
            ingredient = row["name"]
            allergen = row["allergen"]
            if ingredient not in ingredients_allergens:
                ingredients_allergens[ingredient] = []
            ingredients_allergens[ingredient].append(allergen)

        result = [{"ingredient": name, "allergens": allergens} for name, allergens in ingredients_allergens.items()]
        return result

    except Exception as e:
        logger.error("Error fetching ingredient names: %s", str(e))
        raise HTTPException(status_code=500, detail="Error fetching ingredient names")

@router.get("/ingredients", response_model=List[str])
def get_ingredient_names(user=Depends(get_current_user)):
    """
    Returns a list of ingredients for the user's restaurant.
    """
    logger.info("Fetching dish names for user: %s", user.user.id)

    try:
        # Step 1: Query the "user" table to get the associated restaurant_id for the current user
        user_result = supabase.table("users")\
            .select("restaurant_id")\
            .eq("id", user.user.id)\
            .execute()
        
        logger.info("User Result: %s", user_result.data)

        if not user_result.data:
            logger.error("No restaurant associated with this user.")
            raise HTTPException(status_code=404, detail="User has no associated restaurant.")

        restaurant_id = user_result.data[0]['restaurant_id']
        
        # Step 2: Fetch the list of ingredients names
        ingredient_names = supabase.table("ingredients")\
            .select("name")\
            .eq("restaurant_id", restaurant_id)\
            .execute()
        
        ingredient_names = list({ingredient['name'] for ingredient in ingredient_names.data})
        return ingredient_names
    except Exception as e:
        logger.error("Error fetching ingredient names: %s", str(e))
        raise HTTPException(status_code=500, detail="Error fetching ingredient names")

@router.post("/dishes", response_model=dict)
def update_dish(dish_data: dict, user=Depends(get_current_user)):
    """
    Update or create a dish with new ingredients and allergens.
    """
    original_name = dish_data.get("originalName")
    new_name = dish_data.get("newName")
    ingredients = dish_data.get("ingredients", [])

    logger.info(f'Updating dish {original_name} to {new_name} with ingredients {ingredients}')

    try:
        # Step 1: Get the user's associated restaurant_id
        user_result = supabase.table("users")\
            .select("restaurant_id")\
            .eq("id", user.user.id)\
            .execute()

        if not user_result.data:
            logger.error("No restaurant associated with this user.")
            raise HTTPException(status_code=404, detail="User has no associated restaurant.")

        restaurant_id = user_result.data[0]['restaurant_id']

        # Step 2: Delete the existing dish ingredients
        delete_dish_response = supabase.table("dishes")\
            .delete()\
            .eq("restaurant_id", restaurant_id)\
            .eq("name", original_name)\
            .execute()

        logger.info(f'Deleted dish {original_name} from dishes table')

        # Step 4: Delete then insert ingredients and associated allergens
        for ingredient in ingredients:
            ingredient_name = ingredient["ingredient"]
            allergens = ingredient.get("allergens", ["Unknown"])

            delete_ingredients_response = supabase.table("ingredients")\
                .delete()\
                .eq("restaurant_id", restaurant_id)\
                .eq("name", ingredient_name)\
                .execute()

            # Insert each ingredient for the new dish
            insert_ingredient_response = supabase.table("dishes").insert({
                "name": new_name,
                "restaurant_id": restaurant_id,
                "ingredient": ingredient_name
            }).execute()

            logger.info("Inserted ingredient '%s' for dish '%s'", ingredient_name, new_name)

            # Insert allergens for each ingredient
            for allergen in allergens:
                insert_allergen_response = supabase.table("ingredients").insert({
                    "name": ingredient_name,
                    "restaurant_id": restaurant_id,
                    "allergen": allergen
                }).execute()

                logger.info("Inserted allergen '%s' for ingredient '%s'", allergen, ingredient_name)

        logger.info("Dish '%s' updated successfully with new ingredients and allergens", new_name)

        # Return the updated dish structure for confirmation
        return {"name": new_name, "ingredients": ingredients}

    except Exception as e:
        logger.error("Error updating dish: %s", str(e))
        raise HTTPException(status_code=500, detail="Error updating dish.")

@router.get("/dishes", response_model=List[str])
def get_dish_names(user=Depends(get_current_user)):
    """
    Returns a list of dish names for the user's restaurant.
    """
    logger.info("Fetching dish names for user: %s", user.user.id)

    try:
        # Step 1: Query the "user" table to get the associated restaurant_id for the current user
        user_result = supabase.table("users")\
            .select("restaurant_id")\
            .eq("id", user.user.id)\
            .execute()
        
        logger.info("User Result: %s", user_result.data)

        if not user_result.data:
            logger.error("No restaurant associated with this user.")
            raise HTTPException(status_code=404, detail="User has no associated restaurant.")

        restaurant_id = user_result.data[0]['restaurant_id']
        
        # Step 2: Fetch the list of dish names
        dish_result = supabase.table("dishes")\
            .select("name")\
            .eq("restaurant_id", restaurant_id)\
            .execute()
        
        dish_names = list({dish['name'] for dish in dish_result.data})
        return dish_names
    except Exception as e:
        logger.error("Error fetching dish names: %s", str(e))
        raise HTTPException(status_code=500, detail="Error fetching dish names")

@router.get("/dishes/{dishName}", response_model=List[IngredientWithAllergens])
def get_dish_by_name(dishName: str, user=Depends(get_current_user)):
    """
    Fetch a specific dish by its name for the user's restaurant.
    """
    logger.info("Fetching dish by name: %s", dishName)

    try:
        # Step 1: Get the associated restaurant_id for the current user
        user_result = supabase.table("users")\
            .select("restaurant_id")\
            .eq("id", user.user.id)\
            .execute()
        
        if not user_result.data:
            logger.error("No restaurant associated with this user.")
            raise HTTPException(status_code=404, detail="User has no associated restaurant.")

        restaurant_id = user_result.data[0]['restaurant_id']

        # Step 2: Fetch the dish by name for the specified restaurant_id
        dish_result = supabase.table("dishes")\
            .select("name")\
            .eq("restaurant_id", restaurant_id)\
            .eq("name", dishName)\
            .execute()
        
        if not dish_result.data:
            logger.warning("Dish '%s' not found for restaurant_id: %s", dishName, restaurant_id)
            raise HTTPException(status_code=404, detail="Dish not found")

        # Step 3: Fetch all ingredients associated with this dish for the given restaurant_id
        ingredients_result = supabase.table("dishes")\
            .select("ingredient")\
            .eq("restaurant_id", restaurant_id)\
            .eq("name", dishName)\
            .execute()
        
        logger.info("Ingredients Result: %s", ingredients_result)

        # Step 4: Structure ingredients with allergens, ensuring uniqueness
        unique_ingredients = set()
        ingredients_with_allergens = []
        
        for item in ingredients_result.data:
            ingredient_name = item["ingredient"]
            
            # Skip if the ingredient has already been processed
            if ingredient_name in unique_ingredients:
                continue
            
            unique_ingredients.add(ingredient_name)

            # Fetch allergens for the ingredient
            ingredient_result = supabase.table("ingredients")\
                .select("allergen")\
                .eq("restaurant_id", restaurant_id)\
                .eq("name", ingredient_name)\
                .execute()

            # Deduplicate allergens and filter out "Unknown"
            allergens = list(set(
                allergen["allergen"] 
                for allergen in ingredient_result.data 
                if allergen["allergen"] and allergen["allergen"] != "Unknown"
            ))

            ingredients_with_allergens.append({
                "ingredient": ingredient_name,
                "allergens": allergens
            })

        logger.info(f'Successfully fetched dish {dishName} with ingredients and allergens {ingredients_with_allergens}')

        return ingredients_with_allergens

    except Exception as e:
        logger.error("Error fetching dish: %s", str(e))
        raise HTTPException(status_code=500, detail="Error fetching dish")

@router.delete("/dishes/{dishName}")
def delete_dish(dishName: str, user=Depends(get_current_user)):
    """
    Delete a specific dish by its name for the user's restaurant.
    """
    logger.info("Attempting to delete dish: %s", dishName)

    try:
        # Step 1: Get the associated restaurant_id for the current user
        user_result = supabase.table("users")\
            .select("restaurant_id")\
            .eq("id", user.user.id)\
            .execute()

        if not user_result.data:
            logger.error("No restaurant associated with this user.")
            raise HTTPException(status_code=404, detail="User has no associated restaurant.")

        restaurant_id = user_result.data[0]['restaurant_id']

        # Step 2: Check if the dish exists for the specified restaurant_id
        dish_result = supabase.table("dishes")\
            .select("name")\
            .eq("restaurant_id", restaurant_id)\
            .eq("name", dishName)\
            .execute()

        if not dish_result.data:
            logger.warning("Dish '%s' not found for restaurant_id: %s", dishName, restaurant_id)
            raise HTTPException(status_code=404, detail="Dish not found")

        # Step 3: Delete the dish
        delete_result = supabase.table("dishes")\
            .delete()\
            .eq("restaurant_id", restaurant_id)\
            .eq("name", dishName)\
            .execute()

        logger.info(f'Successfully deleted dish {dishName} for restaurant_id: {restaurant_id}')
        return {"message": f"Dish '{dishName}' successfully deleted"}

    except Exception as e:
        logger.error("Error deleting dish: %s", str(e))
        raise HTTPException(status_code=500, detail="Error deleting dish")

@router.get("/tags", response_model=List[str])
def get_tags(user=Depends(get_current_user)):
    """
    Returns a list of available tags (including common allergens).
    """
    logger.info("Fetching tags (allergens) for user: %s", user.user.id)

    try:
        # Step 1: Query the "user" table to get the associated restaurant_id for the current user
        user_result = supabase.table("users")\
            .select("restaurant_id")\
            .eq("id", user.user.id)\
            .execute()
        
        logger.info("User Result: %s", user_result.data)

        if not user_result.data:
            logger.error("No restaurant associated with this user.")
            raise HTTPException(status_code=404, detail="User has no associated restaurant.")

        restaurant_id = user_result.data[0]['restaurant_id']

        # Step 2: Query the ingredients table for unique allergens associated with the user's restaurant
        allergen_result = supabase.table("ingredients")\
            .select("allergen")\
            .eq("restaurant_id", restaurant_id)\
            .execute()
        
        allergens = [ingredient['allergen'] for ingredient in allergen_result.data if ingredient['allergen']]
        logger.info("Fetched Allergens from Ingredients: %s", allergens)

        # Append commonly used allergen tags
        # https://www.canada.ca/en/health-canada/services/food-nutrition/food-safety/food-allergies-intolerances/food-allergies.html
        common_allergens = [
            "Egg", "Milk", "Mustard", "Peanut", "Crustaceans and Molluscs",
            "Fish", "Sesame Seeds", "Soy", "Sulphites", "Tree Nuts", "Wheat and Triticale"
        ]
        
        # Combine the tag list with common allergens and deduplicate if necessary
        return list(set(common_allergens + allergens) - {"Unknown"})
    except Exception as e:
        logger.error("Error fetching tags: %s", str(e))
        raise HTTPException(status_code=500, detail="Error fetching tags")
