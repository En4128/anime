# Use the official Node.js runtime as the base image
FROM node:22-alpine

# Create and set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install only production dependencies (ignoring devDependencies for a smaller size)
RUN npm ci --omit=dev

# Copy all the server source files into the container
COPY . .

# Create the uploads directory for media uploads (if not already existing)
RUN mkdir -p uploads

# Expose the port our Express app runs on (default is 5000)
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"]
