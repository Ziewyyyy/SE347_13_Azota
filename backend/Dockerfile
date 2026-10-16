#Stage 1
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi
COPY . .

#Stage 2
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
USER node
COPY --from=build --chown=node:node /app ./
EXPOSE 5000
CMD ["node", "src/server.js"]
