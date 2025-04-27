# Dockerfile for payment Service

FROM node:20-alpine

RUN npm install -g nodemon

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3004

CMD ["npm", "start"]
