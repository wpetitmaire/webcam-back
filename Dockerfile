# syntax=docker/dockerfile:1

FROM node:16.9.0
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .

RUN npm i -P -g tsc
RUN tsc
CMD [ "node", "dist/app.js" ]