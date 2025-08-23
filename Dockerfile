# Use an official Node.js runtime as a base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies (including dev if needed)
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
