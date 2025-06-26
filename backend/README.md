# 🚀 SprintSync - Full Stack Challenge Docs

SprintSync is a modern task management application with full-stack capabilities and containerized deployment.

---

### 🔗 Live URL
Visit the live version of the app here: [https://sprint-sync-challenge.onrender.com](https://sprint-sync-challenge.onrender.com)

## 📂 Project Structure

```
├── backend
│   ├── prisma
│   ├── src
│   │   ├── routes
│   │   ├── middleware
│   │   ├── lib
│   │   └── app.ts
│   └── swagger
├── frontend
├── docker-compose.yml
├── .env
└── README.md
```

---

## 💡 Tech Stack

* **Frontend**: Next.js (React)
* **Backend**: Express.js + TypeScript
* **ORM**: Prisma
* **Database**: PostgreSQL
* **API Docs**: Swagger
* **Authentication**: JWT
* **Containerization**: Docker + Docker Compose
* **Validation**: Zod

---

## ⚙️ Setup

### Prerequisites

* Node.js v22.12.0
* Docker + Docker Compose

### Install & Run

```bash
cd backend && npm install
cd ../frontend && npm install
```

```bash
docker compose up --build
```

Visit:

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend: [http://localhost:3001](http://localhost:3001)
* Swagger: [http://localhost:3001/docs](http://localhost:3001/docs)

### Seed DB

```bash
cd backend
npm prisma generate
npm prisma db push
npm prisma db seed
```

---

## 🔐 Auth

### `POST /auth/login`

* Authenticates user with email/password
* Returns JWT + user data

### `GET /auth/me`

* Validates JWT
* Returns current user

---

## 👥 Users API

| Method | Endpoint    | Access | Description    |
| ------ | ----------- | ------ | -------------- |
| GET    | /users      | Admin  | List all users |
| POST   | /users      | Admin  | Create user    |
| PUT    | /users/\:id | Admin  | Update user    |
| DELETE | /users/\:id | Admin  | Delete user    |

---

## 📄 Tasks API

| Method | Endpoint           | Description                       |
| ------ | ------------------ | --------------------------------- |
| GET    | /tasks             | List tasks (admin or self)        |
| POST   | /tasks             | Create task                       |
| PUT    | /tasks/\:id        | Update task                       |
| DELETE | /tasks/\:id        | Delete task                       |
| PATCH  | /tasks/\:id/status | Change status + update timestamps |

### Status Workflow

* `PATCH /tasks/:id/status`

  * `IN_PROGRESS`: sets `inProgressAt`
  * `DONE`: sets `completedAt` and calculates `totalMinutes`

---

## 🌱 Seeding Logic

* 5 users (2 Admins)
* Each user:

  * 5 TODO tasks
  * 5 IN\_PROGRESS tasks (with `inProgressAt`)
  * 5 DONE tasks (with `inProgressAt`, `completedAt`, `totalMinutes`)
* `createdAt` always before `inProgressAt` and `completedAt`

Run:

```bash
npm prisma db seed
```

---

## 🎨 Frontend

* **Login**

  * Uses `/auth/login` and `/auth/me`
* **Task Board**

  * Drag & drop task status
  * View by status
  * Form validation + toast feedback
* **Admin Dashboard**

  * Total users
  * Admin count
  * Active user count
  * Total hours logged

---

## 📖 Swagger

* Docs: [http://localhost:3001/docs](http://localhost:3001/docs)
* JSON: [http://localhost:3001/swagger.json](http://localhost:3001/swagger.json)

---

## 📆 Linting & Type Safety

* TypeScript (strict mode)
* ESLint + Prettier
* Zod validation for request schemas

---

---

## 💌 Contact

This project was built for a full-stack engineering challenge. Feedback is welcome!
