# Stage 1: Build
FROM node:20-slim AS build

WORKDIR /app

COPY . .

RUN npm i && npm run build

# Stage 2: Final image
FROM node:20-slim

WORKDIR /app

COPY --from=build /app .

ENV NODE_ENV=production

CMD ["npm", "run", "start"]
