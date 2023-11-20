FROM node:18-slim

WORKDIR /app

COPY . .

RUN npm i
RUN npm run build

CMD [ "npm", "start"]
