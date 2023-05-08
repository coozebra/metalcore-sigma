FROM node:16-alpine as builder

ARG APP_ENV

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build:$APP_ENV

RUN chown -R node:node /app

EXPOSE 3000
USER node

CMD ["node", "dist/server/index.js"]
