# AttendanceIQ 📋

> Track your class attendance. Own your academic record.

AttendanceIQ is a full-stack PERN application that lets students track their own attendance across multiple classes. Users can log whether they were present, late, excused, or absent for each class session, and see at-a-glance attendance percentages to stay on top of their academic standing.

---

## MVP User Stories

- A user can **register** a new account with a username and password
- A user can **log in** and **log out** of their account
- A user can **add classes** (with a name and instructor)
- A user can **delete a class** (which also removes all its attendance records)
- A user can **log an attendance record** for a class on a specific date with a status: `present`, `late`, `excused`, or `absent`
- A user can **view all their attendance records**, filtered by class
- A user can **delete an attendance record**
- A user can **see attendance statistics** (attendance %) per class
- A user's session **persists across page refreshes** via cookie rehydration

---

## Schema Diagram

```
users
├── user_id     SERIAL PRIMARY KEY
├── username    TEXT UNIQUE NOT NULL
└── password_hash TEXT NOT NULL

classes
├── class_id    SERIAL PRIMARY KEY
├── name        TEXT NOT NULL
├── instructor  TEXT NOT NULL
└── user_id     INT → users(user_id) ON DELETE CASCADE

attendance_records
├── record_id   SERIAL PRIMARY KEY
├── class_id    INT → classes(class_id) ON DELETE CASCADE
├── date        DATE NOT NULL
├── status      TEXT NOT NULL  CHECK IN ('present','absent','late','excused')
├── notes       TEXT
└── user_id     INT → users(user_id) ON DELETE CASCADE
```

---

## API Contract

### Auth Endpoints

| Method | Route | Description | Request Body | Response |
|--------|-------|-------------|-------------|----------|
| `POST` | `/api/auth/register` | Register a new user | `{ username, password }` | `201` `{ user_id, username }` |
| `POST` | `/api/auth/login` | Log in | `{ username, password }` | `200` `{ user_id, username }` |
| `GET`  | `/api/auth/me` | Get current session user | — | `200` `{ user_id, username }` or `null` |
| `DELETE` | `/api/auth/logout` | Log out | — | `200` `{ message }` |

### Class Endpoints (all require authentication)

| Method | Route | Description | Request Body | Response |
|--------|-------|-------------|-------------|----------|
| `GET`    | `/api/classes` | List all classes for current user | — | `200` `[{ class_id, name, instructor, user_id }]` |
| `POST`   | `/api/classes` | Create a class | `{ name, instructor }` | `201` `{ class_id, name, instructor, user_id }` |
| `PATCH`  | `/api/classes/:class_id` | Update a class | `{ name, instructor }` | `200` updated class |
| `DELETE` | `/api/classes/:class_id` | Delete a class (cascades) | — | `200` deleted class |

### Attendance Record Endpoints (all require authentication)

| Method | Route | Description | Request Body | Response |
|--------|-------|-------------|-------------|----------|
| `GET`    | `/api/attendance` | List all records (optionally `?class_id=N`) | — | `200` `[{ record_id, class_name, date, status, notes, ... }]` |
| `GET`    | `/api/attendance/stats` | Attendance summary per class | — | `200` `[{ class_id, class_name, present_count, absent_count, ... }]` |
| `POST`   | `/api/attendance` | Log a new record | `{ class_id, date, status, notes? }` | `201` `{ record_id, ... }` |
| `PATCH`  | `/api/attendance/:record_id` | Update status/notes | `{ status?, notes? }` | `200` updated record |
| `DELETE` | `/api/attendance/:record_id` | Delete a record | — | `200` deleted record |

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- PostgreSQL

### 1. Clone the repo

```bash
git clone https://github.com/your-username/attendance-tracker.git
cd attendance-tracker
```

### 2. Set up the server

```bash
cd server
npm install
cp .env.template .env
# Fill in your Postgres credentials and a SESSION_SECRET in .env
```

### 3. Seed the database

```bash
npm run db:seed
```

This drops and recreates the tables, then inserts two seed users (`alice` / `bob`, both with password `password123`) and sample classes and records.

### 4. Start the server

```bash
npm run dev   # uses nodemon for hot-reload
```

Server runs on `http://localhost:8080`.

### 5. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`. The Vite proxy forwards all `/api` requests to the Express server so cookies work correctly.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Database | PostgreSQL |
| Server | Node.js + Express |
| Auth | cookie-session + bcrypt |
| Frontend | Vite + React |
| Styling | Custom CSS (dark theme) |

---

## Roadmap (Stretch Features)

- [ ] **PATCH records inline** — edit status/notes directly from the list
- [ ] **React Router** — separate page per class with a detail view
- [ ] **Export to CSV** — download attendance history for a class
- [ ] **Warning threshold** — alert when attendance % drops below 75%
- [ ] **Global Context** — move `currentUser` into React Context instead of prop-drilling
- [ ] **Calendar view** — visualize attendance on a monthly calendar grid
- [ ] **Recurring sessions** — bulk-log attendance for a whole semester schedule
