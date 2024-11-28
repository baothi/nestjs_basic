# Use Node.js 20.11.1 Alpine as base image
FROM node:20.11.1-alpine

# Add necessary build dependencies
RUN apk add --no-cache python3 make g++

# Create app directory
WORKDIR /app/backend-nest

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install --legacy-peer-deps

RUN npm i -g @nestjs/cli@10.4.8

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]