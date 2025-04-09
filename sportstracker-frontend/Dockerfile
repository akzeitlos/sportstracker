#############################
# 👉 Development Stage
#############################
FROM node:18 AS dev

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]

#############################
# 👉 Production Stage
#############################
FROM node:18 AS prod

WORKDIR /app

# Nur dist und package.json falls nötig
# COPY dist ./dist

COPY package*.json ./
RUN npm install -g serve && npm install

# Nur ohne Build!
# COPY . .

#Server zu schwach
RUN npm run build

# Optional: .htaccess für client-side routing
COPY .htaccess ./dist/

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
