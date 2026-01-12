# Base image
FROM node:18-alpine

# App directory
WORKDIR /usr/src/app

# Environment variable NAMES only (NO secrets)
ENV DOMAIN=http://localhost:3000 \
    PORT=3000 \
    STATIC_DIR=./client

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "server.js"]

