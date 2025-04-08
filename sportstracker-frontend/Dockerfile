# Base image
FROM node:18

# Create app directory
WORKDIR /app

COPY .htaccess ./dist/

# Install dependencies
COPY package*.json ./
RUN npm install -g serve && npm install

# Copy the rest of the app
COPY . .

# Default build step (overridden in dev)
RUN npm run build

# Expose port used by Vite or serve
EXPOSE 3000

# In production, serve the built files
CMD ["serve", "-s", "dist", "-l", "3000"]