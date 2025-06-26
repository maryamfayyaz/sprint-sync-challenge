# SprintSync - Full Stack Challenge Documentation

#Backend

## Overview

SprintSync is a task management application built with a modern full-stack architecture:

* **Frontend**: Next.js (React)
* **Backend**: Express.js, Prisma ORM, PostgreSQL
* **Containerization**: Docker with Docker Compose
* **Documentation**: Swagger (OpenAPI Spec)

---

## Folder Structure

```
├── backend
│   ├── prisma
│   ├── src
│   ├── swagger
│   └── app.js
├── frontend
│   └── (Next.js frontend)
├── docker-compose.yml
├── .env
└── estimates.csv
```

---

## Setup Instructions

### 1. Prerequisites

* Node.js v22.12.0
* Docker & Docker Compose

### 2. Local Setup

1. **Install dependencies**:

   ```bash
   cd backend && pnpm install
   cd ../frontend && pnpm install
   ```
2. **Database**:
   Ensure PostgreSQL is not using port `5431` locally. Otherwise, adjust in `docker-compose.yml`.

### 3. Running with Docker

```bash
docker compose up --build
```

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend: [http://localhost:3001](http://localhost:3001)
* Swagger Docs: [http://localhost:3001/docs](http://localhost:3001/docs)

### 4. Seed Database

```bash
cd backend
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed
```

Seeds:

* 5 Users (2 Admins)
* Each user has 5 tasks in each status (TODO, IN\_PROGRESS, DONE)

---

## Backend Features

### Auth

* `POST /auth/login`

  * Validates with Zod
  * Returns JWT

### Users

* `GET /users`
* `POST /users`
* `PUT /users/:id`
* `DELETE /users/:id`

### Tasks

* `GET /tasks`

  * Admins: See all tasks
  * Users: See own tasks
  * Includes grouped total logged minutes
* `POST /tasks`
* `PUT /tasks/:id`
* `DELETE /tasks/:id`

### AI Suggestion (Stubbed)

* `POST /ai/suggest`

  * Placeholder for OpenAI/Anthropic integration

### Validation & Errors

* Reusable `parseWithZod()` utility for safe Zod schema parsing
* Centralized async error handling with `express-async-handler`

---

## Frontend Features

* Login Page with API integration
* Task Board

  * Create / Edit Tasks
  * Drag & Drop to change status
  * API connected
* UI validated with Toast feedback
* Fully mobile responsive

---

## Swagger/OpenAPI

* Auto-generated from inline route comments
* View at: `http://localhost:3001/docs`
* Raw JSON: `http://localhost:3001/swagger.json`

---

## Linting & Type Safety

* ESLint + Prettier integrated
* Type errors fixed
* Build passes cleanly

---