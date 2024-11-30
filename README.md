# Allergenie
**Production:** [https://allergenie.ca/](https://allergenie.ca/)  
**Development:** [https://allergenie-dev.up.railway.app/](https://allergenie-dev.up.railway.app/)  
**Railway Deployments:** [https://railway.app/project/1627eb04-2e6e-4749-b8f1-85878ff99681](https://railway.app/project/1627eb04-2e6e-4749-b8f1-85878ff99681)

### Features
**Implemented**:
- Login
- Logout
- Search Allergen
- Search Ingredient
- Add Ingredients
- Add Dishes
- Set and Search Categories
- Clear Landing Page/Contact Page
- ...

**Planned**:
- Set Alert to Update Menu
- Restauraunt Settings/Features
- Image Recognition for Inputting Recipes
- Account Setup/Payment Integration
- User Account Management
- ...

### GitHub Workflow

![GitHub Workflow](https://github.com/user-attachments/assets/996b1a56-9e73-4328-93dc-6cc9c752d0b1)

### Project Architecture

![Allergenie Architecture drawio](https://github.com/user-attachments/assets/89d1e3e1-cd7f-4675-ac16-2a1f035803e4)

AllerGenie is hosted on Railway, with a reverse proxy serving as the entry point for both frontend and backend services. The frontend is built with React (using Vite), and the backend is developed with FastAPI. For authentication, data storage, and retrieval, our backend integrates with Supabase (a PostgreSQL instance as a service).

How it Works
User Request:
When a user visits AllerGenie.ca, their request is routed through Cloudflare to our Railway reverse proxy.

Frontend Handling:
The reverse proxy forwards the request to the React-based frontend. The appropriate HTML page is served to the user.

Backend Communication:
If the frontend needs data (e.g., allergens or dishes), it sends an API request via the reverse proxy to the FastAPI backend.
The backend queries Supabase to retrieve or update the necessary data.
The backend processes the data and sends a response back through the reverse proxy to the frontend.

Response Delivery:
The user’s browser receives the fully rendered page, including any dynamic data.
