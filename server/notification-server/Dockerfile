# Dockerfile for notification Service

FROM node:20-alpine

RUN npm install -g nodemon

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3005

CMD ["npm", "start"]
