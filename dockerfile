# Use an official Node.js image with a Chromium-compatible version
FROM node:20-bullseye
# FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies first to optimize build cache
COPY package*.json ./
RUN npm ci --only=production


# Copy project files (excluding files in .dockerignore)
COPY . .

# Expose the port your Node.js app runs on
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
