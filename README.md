# Fullstack Application with NextJS, NestJS, WhatsApp API, and PostgreSQL

## 📦 Project Structure

```

project-root/
├── backend/        # Main backend application (NestJS)
│   ├── src/
│   ├── test/
│   ├── .env
│   ├── Dockerfile
│   └── package.json
│
├── client/         # WhatsApp API service
│   ├── src/
│   ├── .env
│   ├── Dockerfile
│   └── package.json
│
├── frontend/       # frontend(Next.js)
│   ├── src/
│   ├── .env
│   ├── Dockerfile
│   └── package.json
│
├── .env            # Optional: root-level environment variables
├── .gitignore      # Git ignore rules
├── Caddyfile       # Optional reverse proxy config (Caddy server)
├── compose.yaml    # Docker Compose file for running services
```

---


## 🚀 Services Overview

### 🔧 Backend (`/backend`)

- **Framework**: [NestJS](https://nestjs.com/)
- **Purpose**: API server handling business logic, authentication, and database interaction
- **Database**: Connects to PostgreSQL via Prisma

### 💬 Client (`/client`)

- **Purpose**: WhatsApp API integration (e.g., notifications, bot services)
- **Tech Stack**: Node.js or NestJS
- **External APIs**: Meta WhatsApp API, Twilio, etc.

### 🌐 Frontend (`/frontend`)

- **Framework**: [Next.js](https://nextjs.org/)
- **Purpose**: Admin or user-facing web interface
- **Interaction**: Communicates with the backend API

### 🗃️ Database

- **Image**: `postgres:15-alpine`
- **Port**: `5432`
- **Persistence**: Docker volume mounted at `/var/lib/postgresql/data`

---

## 🐳 Docker Compose

Defined in `compose.yaml`:

- `db` – PostgreSQL container
- `backend` – NestJS API service
- `frontend` – Next.js frontend app
- `client` – WhatsApp integration service
- *(Optional)* `caddy` – Caddy reverse proxy for HTTPS support

## 🛠️ Build & Run with Docker Compose

### Clone the Repository

```bash
git clone https://github.com/wignn/rpl-prod.git
cd rpl-frontend
```

### Setting Up Environment Variables

Before running the application, you need to set up environment variables for each service. Follow these steps:

1. **Rename `.env.example` to `.env`**  
   For each service (`backend`, `client`, `frontend`), copy the `.env.example` file and rename it to `.env`.

   ```bash
   cp backend/.env.example backend/.env
   cp client/.env.example client/.env
   cp frontend/.env.example frontend/.env
   ```

2. **Edit the `.env` Files**  
   Open each `.env` file and fill in the required values such as API keys, database URLs, secrets, etc.

---

### docker-compose build

Navigate to the project root and run:

```bash
docker-compose build
```

This will build all the services defined in compose.yaml (backend, client, frontend, and database).

### Start the Application

Once the build process is complete, start the containers:

```bash
docker-compose up
```

Docker Compose will start all the services and connect them via the defined app-network.

### Accessing the Services

- Backend API: <http://localhost:3000>
- Frontend: <http://localhost:4000>
- PostgreSQL Database: Running on port 5432 (used by backend service).
- WhatsApp Client: Integrated with backend for sending/receiving messages.

### Stopping the Containers

To stop the containers and clean up:

```bash
docker-compose down
```

docker-compose down

### 📝 Additional Notes

- Environment Variables: Don't forget to configure .env files for each servic. (backend, client, frontend) to set up API keys, database connections, etc.

- Persistent Data: PostgreSQL data is persisted via Docker volumes, so even if the container is stopped or removed, your data will remain intact.

- Caddy: If you're using Caddy for reverse proxy and HTTPS support, ensure your Caddyfile is configured correctly.
