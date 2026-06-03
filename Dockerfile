# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Prisma schema and config
# Copy prisma config and schema
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Copy the rest of the application code
COPY . .

# Generate Prisma client (after source is present so output lands in src/generated)
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000

# Define the command to run the app
CMD ["npm", "start"]
