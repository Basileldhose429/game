# Dockerfile
FROM node:18-slim

WORKDIR /app

# Install system dependencies for native modules (sqlite3, bcrypt)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 8081
CMD ["node", "server.js"]
