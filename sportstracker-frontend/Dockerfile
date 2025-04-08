# 1. Build Stage
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

# Installiere alle Abhängigkeiten (auch devDependencies)
RUN npm --version
RUN npm install --verbose

COPY . .

# Baue die Anwendung (falls nötig)
RUN npm run build

# 2. Production Stage
FROM node:18-alpine

WORKDIR /app

# Kopiere nur die benötigten Dateien aus der Build-Phase
COPY --from=builder /app /app

# Exponiere den Port, auf dem die Anwendung laufen soll
EXPOSE 3000

# Führe Vite aus, indem du es direkt aus dem node_modules-Verzeichnis startest
CMD ["./node_modules/.bin/vite", "preview", "--host", "--port", "3000"]