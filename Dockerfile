# Use an official Node.js runtime as a parent image
FROM node:14-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and other necessary files
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

# Make port 5005 available to the world outside this container
EXPOSE 5005

# Define command to run the app
CMD ["npm", "start"]