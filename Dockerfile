FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build:api

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
ENV DATA_DIR=/data
COPY --from=build /app/dist/boot.js ./dist/boot.js
VOLUME ["/data"]
EXPOSE 3000
CMD ["node", "dist/boot.js"]
