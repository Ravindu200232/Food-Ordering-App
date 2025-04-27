

# Food Ordering System — Deployment Guide

This document provides the step-by-step instructions to deploy the **Food Ordering System** using Docker and Docker Compose.

## 📦 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- Internet connection (for pulling MongoDB image and accessing Atlas DB)

---

## 🚀 Deployment Steps

### 1. Clone the Project Repository

```bash
git clone GitHub Rep---> https://github.com/Ravindu200232/Food-Ordering-App.git
cd your-repo-name
```

> Make sure your local folder structure includes:
> - `/server/user-service`
> - `/server/order-service`
> - `/server/Restaurant-service`
> - `/server/deliver-service`
> - `/server/payment-service`
> - `/server/notification-server`
> - `/client`

---

### 2. Verify Dockerfile and docker-compose.yml

Ensure each service folder (`user-service`, `order-service`, `Restaurant-service`, etc.) contains a valid `Dockerfile`.

The root folder should have the provided `docker-compose.yml`.

---

### 3. Build and Start Containers

In the root project directory (where `docker-compose.yml` is located), run:

```bash
docker-compose up --build
```

This will:
- Pull the official **MongoDB** image
- Build custom images for each microservice
- Start all services and the frontend client

---

### 4. Access the Application

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend Services**:
  - User Service: [http://localhost:3000](http://localhost:3000)
  - Order Service: [http://localhost:3001](http://localhost:3001)
  - Restaurant Service: [http://localhost:3002](http://localhost:3002)
  - Delivery Service: [http://localhost:3003](http://localhost:3003)
  - Payment Service: [http://localhost:3004](http://localhost:3004)
  - Notification Service: [http://localhost:3005](http://localhost:3005)
- **MongoDB** is connected via your **Mongo Atlas URI** (no local access needed)

---

## ⚙️ Useful Docker Commands

| Command                        | Description                            |
|:--------------------------------|:---------------------------------------|
| `docker-compose up`             | Start services                        |
| `docker-compose down`           | Stop and remove services and networks |
| `docker-compose up --build`     | Build and start fresh                 |
| `docker ps`                     | List running containers               |
| `docker-compose logs -f`         | Stream logs from all services         |

---

## 📝 Notes

- Services are automatically rebuilt when source code changes (due to volume mounts).
- MongoDB connection is external, using Mongo Atlas URI for production-style hosting.
- If port conflicts occur, adjust the exposed ports in `docker-compose.yml`.

---

# ✅ Congratulations!

