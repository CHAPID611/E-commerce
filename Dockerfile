# Use Node.js LTS (Long Term Support) as the base image
FROM node:18-alpine

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy TypeScript configuration
COPY tsconfig.json ./

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run compile

# Expose the port the app will run on
EXPOSE 4000

# Start the application
CMD ["npm", "start"]

