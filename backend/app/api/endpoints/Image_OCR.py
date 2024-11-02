from fastapi import APIRouter, HTTPException, File, UploadFile, Depends
from typing import Dict
from openai import OpenAI
from google.cloud import vision
import os

# Set up environment variables
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\\Users\\Nathan\\Downloads\\allergen-ocr-b2f772c23fef.json"
# Instantiate OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
# Initialize FastAPI router
router = APIRouter()

# Function to extract text from image using Google Vision
def extract_text_from_image(image_content: bytes) -> str:
    client = vision.ImageAnnotatorClient()
    image = vision.Image(content=image_content)
    response = client.text_detection(image=image)

    if response.error.message:
        raise Exception(f"Error with Vision API: {response.error.message}")
    
    # Extracted text from the image
    text = response.full_text_annotation.text
    return text

# Function to get structured menu data from GPT-4o
def get_structured_menu_data(text: str) -> Dict:
    prompt = (
        "Extract the menu item and ingredients from the following text and format it as JSON. "
        "Do not include any quantities/measurements, only the name of the ingredient.\n\n"
        "Text:\n"
        f"{text}\n\n"
    )

    # Use GPT-4o model to get structured output with the specified JSON schema
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that extracts menu items and ingredients."},
            {"role": "user", "content": prompt}
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "menu_item_extraction",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "menu_item": {"type": "string"},
                        "ingredients": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    },
                    "required": ["menu_item", "ingredients"],
                    "additionalProperties": False
                }
            }
        }
    )

    # Print the raw response for debugging
    print("Raw response:", response)

    # Attempt to retrieve structured data
    try:
        structured_data = response.model_dump().get("choices")[0].get("message").get("content")
    except KeyError as e:
        raise ValueError(f"Unexpected response structure: {response}") from e
    
    return structured_data

# FastAPI endpoint
@router.post("/process-menu-image/", response_model=Dict)
async def process_menu_image(file: UploadFile = File(...)):
    """
    Endpoint to process an uploaded image and return structured JSON data with menu item and ingredients.

    Args:
        file (UploadFile): The image file containing menu text.

    Returns:
        Dict: JSON data with the menu item and ingredients.
    """
    try:
        # Read image file contents
        image_content = await file.read()

        # Step 1: Extract text from the image
        text = extract_text_from_image(image_content)
        
        # Step 2: Get structured menu data from GPT-4
        structured_data = get_structured_menu_data(text)
        
        return {"data": structured_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
