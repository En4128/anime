# ==========================================
# STAGE 1: Build the React Application
# ==========================================
# Use the official Node.js image to build our frontend app
FROM node:22-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to cache dependencies install
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy all the frontend files into the container
COPY . .

# Set environment variables for the build process (Vite reads these)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the app to generate production static files (creates a 'dist' folder)
RUN npm run build

# ==========================================
# STAGE 2: Serve the Static Files using Nginx
# ==========================================
# Use a lightweight Nginx image to serve static files
FROM nginx:alpine

# Copy our custom Nginx config file to the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from STAGE 1 (build) to Nginx's public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
