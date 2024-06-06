# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Build the Angular application (you can add --prod if needed)
RUN npm run build

# Expose port 80
EXPOSE 80

# Define the command to start the Angular app (using http-server)
CMD [ "npx", "http-server", "-p", "80", "-d", "false" ]
