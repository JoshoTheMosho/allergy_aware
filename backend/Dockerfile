# Use the official Python image as the base
FROM python:3.11

# URLs from Railway
ARG FRONTEND_URL
ARG SUPABASE_URL
ARG SUPABASE_KEY

# Set the environment variables
ENV FRONTEND_URL=$FRONTEND_URL
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_KEY=$SUPABASE_KEY

# Set the working directory inside the container
WORKDIR /code

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "::", "--port", "8000"]
