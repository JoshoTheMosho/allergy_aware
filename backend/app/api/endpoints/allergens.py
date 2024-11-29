from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List

from ...core.config import supabase
from ..dependencies.get_user import get_current_user
from ...schemas.dish import Dish
from ...schemas.dish import sort_dishes_by_name
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
    
    return sort_dishes_by_name(dishes)

def get_all_dishes_from_ingredients(dishes_result, ingredients_data):
    # Assisted with AI tools to optimize the code
    # Build a mapping from dish name to list of ingredients
    dish_ingredients = {}
    for dish in dishes_result.data:
        dish_name = dish.get('name', '')
        ingredient = dish.get('ingredient', '')
        dish_ingredients.setdefault(dish_name, []).append(ingredient)

    # Build a mapping from ingredient name to allergen
    ingredient_allergens = {}
    for ingredient_row in ingredients_data:
        ingredient_name = ingredient_row.get('name', '').lower()
        allergen = ingredient_row.get('allergen', '')
        if allergen != "Unknown":
            ingredient_allergens[ingredient_name] = allergen

    # Build the list of Dish objects
    dishes = []
    for dish_name, ingredients_list in dish_ingredients.items():
        dish_allergens = set()
        for ingredient in ingredients_list:
            # Find matching allergens for each ingredient
            for ing_name, allergen in ingredient_allergens.items():
                if ingredient.lower() in ing_name:
                    dish_allergens.add(allergen)
        dishes.append(Dish(
            name=dish_name,
            ingredients=sorted(ingredients_list),
            allergens=sorted(list(dish_allergens)),
            restaurant_id=dishes_result.data[0]['restaurant_id']
        ))

    return sort_dishes_by_name(dishes)


@router.get("/search/", response_model=List[Dish])
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
        
        dish_ingredients = {}
        for dish in dishes_data:
            dish_name = dish.get('name', '')
            ingredient = dish.get('ingredient', '')
            dish_ingredients.setdefault(dish_name, []).append(ingredient)
        
        # Step 3: Fetch all ingredients for the restaurant
        ingredients_result = supabase.table("ingredients")\
            .select("*")\
            .eq("restaurant_id", restaurant_id)\
            .execute()

        ingredients_data = ingredients_result.data or []

        # Step 4: Build a mapping from ingredient name to allergen
        ingredient_allergens = {
            ingredient['name'].lower(): ingredient['allergen']
            for ingredient in ingredients_data
            if ingredient['allergen'] != "Unknown"
        }


        # Step 5: Build the list of Dish objects
        dishes = []
        for dish_name, ingredients_list in dish_ingredients.items():
            dish_allergens = set()
            for ingredient in ingredients_list:
                ingredient_lower = ingredient.lower()
                # Find the allergen for the ingredient, if any
                allergen = ingredient_allergens.get(ingredient_lower)
                if allergen:
                    dish_allergens.add(allergen)
            dishes.append(Dish(
                name=dish_name,
                ingredients=ingredients_list,
                allergens=list(dish_allergens),
                restaurant_id=restaurant_id
            ))

        return sort_dishes_by_name(dishes)
    
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
        
        # unique_dish_names = set()
        # for dish in dishes_result.data:
        #     dish_name = dish.get('name', [])
        #     if dish_name not in unique_dish_names:
        #         unique_dish_names.add(dish_name)
    
        # dishes = get_all_dishes(unique_dish_names, dishes_result, restaurant_id)
        # return dishes

        # Fetch all ingredients for the restaurant
        ingredients_result = supabase.table("ingredients")\
            .select("*")\
            .eq("restaurant_id", restaurant_id)\
            .execute()

        if not ingredients_result.data:
            return []

        # Get all dishes with optimized processing
        dishes = get_all_dishes_from_ingredients(dishes_result, ingredients_result.data)
        return sort_dishes_by_name(dishes)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dishes_by_category/", response_model=List[Dish])
def get_dishes_by_category(category_name: str = Query(..., title="Category Name", description="The name of the category to filter dishes by"), user=Depends(get_current_user)):
    """
    Retrieve dishes for the authenticated user's restaurant filtered by category.
    """
    try:
        # Get user's restaurant ID
        user_result = supabase.table("users")\
            .select("restaurant_id")\
            .eq("id", user.user.id)\
            .execute()

        if not user_result.data:
            raise HTTPException(status_code=404, detail="User or restaurant not found")

        restaurant_id = user_result.data[0]['restaurant_id']

        # Assisted with AI tools to optimize the code
        # Fetch dish names in the specified category
        category_dishes_result = supabase.table("categories")\
            .select("dish_name")\
            .eq("restaurant_id", restaurant_id)\
            .eq("category", category_name)\
            .execute()

        if not category_dishes_result.data:
            return []

        dish_names = [dish['dish_name'] for dish in category_dishes_result.data]

        # Fetch dishes with the selected names
        dishes_result = supabase.table("dishes")\
            .select("*")\
            .in_("name", dish_names)\
            .eq("restaurant_id", restaurant_id)\
            .execute()

        if not dishes_result.data:
            return []

        # Fetch all ingredients for the restaurant
        ingredients_result = supabase.table("ingredients")\
        .select("*")\
            .eq("restaurant_id", restaurant_id)\
            .execute()

        if not ingredients_result.data:
            return []

        # Build mappings for quick lookups
        ingredient_allergens = {
            ingredient['name'].lower(): ingredient['allergen']
            for ingredient in ingredients_result.data
            if ingredient['allergen'] != "Unknown"
        }

        # Build a mapping from dish name to its ingredients and allergens
        dishes_dict = {}
        for dish in dishes_result.data:
            dish_name = dish.get('name', '')
            ingredient = dish.get('ingredient', '')
            ingredient_lower = ingredient.lower()

            # Initialize the dish entry if it doesn't exist
            if dish_name not in dishes_dict:
                dishes_dict[dish_name] = {
                    'ingredients': [],
                    'allergens': set()
                }

            # Add the ingredient to the dish's ingredient list
            dishes_dict[dish_name]['ingredients'].append(ingredient)

            # Find the allergen for the ingredient, if any
            for ing_name, allergen in ingredient_allergens.items():
                if ingredient_lower == ing_name:
                    dishes_dict[dish_name]['allergens'].add(allergen)
                    break  # Found the allergen, no need to check further

        # Build the list of Dish objects
        dishes = []
        for dish_name, data in dishes_dict.items():
            dishes.append(Dish(
                name=dish_name,
                ingredients=data['ingredients'],
                allergens=list(data['allergens']),
                restaurant_id=restaurant_id
            ))


        return sort_dishes_by_name(dishes)
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

        return sorted(categories)

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
            if allergen == "Unknown":
                continue
            ingredients_allergens[ingredient].append(allergen)

        result = [{"ingredient": name, "allergens": sorted(allergens)} for name, allergens in ingredients_allergens.items()]
        return sorted(result, key=lambda x: x["ingredient"]) or [{}]
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
    category = dish_data.get("category")
    ingredients = dish_data.get("ingredients", [])

    logger.info(f'Updating dish {original_name} to {new_name} in category {category} with ingredients {ingredients}')

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
        category_id = None
        
        # Step 3: Update new dish name in categories table
        if original_name != new_name:
            update_dish_response = supabase.table("categories")\
                .update({"dish_name": new_name})\
                .eq("restaurant_id", restaurant_id)\
                .eq("dish_name", original_name)\
                .execute()

            logger.info(f'Updated dish name {original_name} to {new_name} in categories table')

        # Step 4: Ensure the category exists & upsert the category
        if category:
            logger.info(f'Fetching category ID for restaurant_id {restaurant_id} and category {category}')

            category_result = supabase.table("category_id").select("category_id").eq("category_name", category).eq("restaurant_id", restaurant_id).execute()


            if not category_result.data:
                logger.info(f'Category {category} does not exist in category_id. Inserting category {category} for restaurant_id {restaurant_id}')

                # Create a category
                category_insert_response = supabase.table("category_id")\
                    .insert({'category_name': category, 'restaurant_id': restaurant_id})\
                    .execute()
                category_id = category_insert_response.data[0]['category_id']            
            else:
                logger.info(f'Category result: {category_result.data} {category_result.data[0]} {category_result.data[0]["category_id"]}')
                category_id = category_result.data[0]['category_id'] 

        if category_id is not None:
            logger.info(f'Upserting category {category} with category_id {category_id} for dish {new_name}')

            # Upsert category into category table
            category_upsert_response = supabase.table("categories")\
                .upsert({'category': category, 'category_id': category_id, 'dish_name': new_name, 'restaurant_id': restaurant_id})\
                .execute()
            
            logger.info(f'Upserted category {category} for dish {new_name}')
        else:
            logger.info(f'Clearing category for dish {new_name}')

            category_delete_response = supabase.table("categories")\
                .delete()\
                .eq("restaurant_id", restaurant_id)\
                .eq("dish_name", new_name)\
                .execute()

        # Step 5: Delete then insert ingredients and associated allergens
        for ingredient in ingredients:
            ingredient_name = ingredient["ingredient"]
            allergens = ingredient.get("allergens", ["Unknown"])

            if not allergens:
                allergens = ["Unknown"]

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

            logger.info("Allergens: %s", allergens)

            # Insert allergens for each ingredient
            for allergen in allergens:
                print("Allergen: ", allergen)
                print("Ingredient Name: ", ingredient_name)

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
        return sorted(dish_names) or []
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
            allergens = sorted(list(set(
                allergen["allergen"] 
                for allergen in ingredient_result.data 
                if allergen["allergen"] and allergen["allergen"] != "Unknown"
            )))

            ingredients_with_allergens.append({
                "ingredient": ingredient_name,
                "allergens": allergens
            })

        logger.info(f'Successfully fetched dish {dishName} with ingredients and allergens {ingredients_with_allergens}')

        return sorted(ingredients_with_allergens, key=lambda x: x["ingredient"])

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

@router.get("/categories", response_model=List[str])
def get_categories(user=Depends(get_current_user)):
    """
    Returns a list of category names for the user's restaurant.
    """
    logger.info("Fetching categories for user: %s", user.user.id)

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
        
        # Step 2: Fetch the list of category names
        category_results = supabase.table("category_id")\
            .select("category_name")\
            .eq("restaurant_id", restaurant_id)\
            .execute()
        
        categories = list({category['category_name'] for category in category_results.data})

        return sorted(categories) or []

    except Exception as e:
        logger.error("Error fetching categories: %s", str(e))
        raise HTTPException(status_code=500, detail="Error fetching categories")

@router.get("/categories/{dish_name}", response_model=str)
def get_dish_category(dish_name: str, user=Depends(get_current_user)):
    """
    Returns the category a dish is under.
    """
    logger.info("Fetching categories for user: %s", user.user.id)

    try:
        # Step 1: Query the "user" table to get the associated restaurant_id for the current user
        user_result = supabase.table("users")\
            .select("restaurant_id")\
            .eq("id", user.user.id)\
            .execute()
        
        if not user_result.data:
            logger.error("No restaurant associated with this user.")
            raise HTTPException(status_code=404, detail="User has no associated restaurant.")

        restaurant_id = user_result.data[0]['restaurant_id']

        logger.info("Fetching category name for dish: %s", dish_name)
        
        # Step 2: Fetch the category name
        category = supabase.table("categories")\
            .select("category")\
            .eq("restaurant_id", restaurant_id)\
            .eq("dish_name", dish_name)\
            .execute()
        
        logger.info("Category Result: %s", category.data)

        return category.data[0]['category'] if category.data else ''
    except Exception as e:
        logger.error(f"Error fetching category for {dish_name}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching categories")
