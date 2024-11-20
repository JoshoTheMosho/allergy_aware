# Stage 1: Build the React app
FROM node:20 AS build

# URLs from Railway
ARG VITE_BACKEND_URL

# Set the working directory inside the container
WORKDIR /code

# Copy the package.json and package-lock.json (if it exists) into the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the React app for production
RUN npm run build

# Start 
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
