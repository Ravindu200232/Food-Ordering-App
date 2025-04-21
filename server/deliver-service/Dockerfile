# Dockerfile for delivery Service

FROM node:20-slim

RUN npm install -g nodemon

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5000

# Start the app
CMD ["npm", "start"]

