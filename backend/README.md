# Allergy Management App

## Overview

The Allergy Management App is designed to help users manage and track allergens in various dishes offered by restaurants. The backend is built using FastAPI and Supabase for authentication and data storage.

## Features

- User authentication (login)
- Search for dishes based on allergens or ingredients

## Installation

### Prerequisites

- Python 3.8+
- [Supabase](https://supabase.io/) account and project

### Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/allergy-management-app.git
    cd allergy-management-app
    ```

2. Create a virtual environment and activate it:

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the required dependencies:

    ```bash
    pip install -r requirements.txt
    ```

4. Set up environment variables:

    Create a `.env` file in the root directory and add your Supabase URL and key and set development modew:

    ```env
    SUPABASE_URL=your_supabase_url
    SUPABASE_KEY=your_supabase_key
    ENVIRONMENT=development
    ```

5. Run the FastAPI application:

    ```bash
    uvicorn app.main:app --reload
    ```

    The application will be available at `http://127.0.0.1:8000`.

## Project Structure

```plaintext
allergy-management-app/
├── app/
│   ├── api/
│   │   ├── dependencies/
│   │   │   ├── get_user.py
│   │   ├── endpoints/
│   │   │   ├── allergens.py
│   │   │   ├── auth.py
│   │   ├── router.py
│   ├── core/
│   │   ├── config.py
│   ├── schemas/
│   │   ├── dish.py
│   │   ├── ingredient.py
│   │   ├── restaurant.py
│   ├── main.py
├── .env
├── Dockerfile
├── README.md
├── requirements.txt
