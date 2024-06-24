# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

COPY . .

RUN npm i && npm run build

# Stage 2: Final image
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app .

ENV NODE_ENV=production

CMD ["npm", "run", "start"]
