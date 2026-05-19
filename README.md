# Attendance Tracker — Full-Stack

A full-stack Attendance Tracker built with React, Express, and Postgres. Demonstrates session-based authentication, session rehydration, auth-dependent data fetching, and conditional rendering — the same patterns students use in their full-stack projects.

---

## User Stories

### Auth

- A user can register for an account with a username and password
- A user can log in to an existing account
- A user can log out
- A returning user who has an active session is automatically logged in when they revisit the app

### Attendance

- A logged-in user can see all students in their class
- A logged-in user can create a new student record by entering a name
- A logged-in user can mark a student as present or absent for today
- A logged-in user can view attendance history for any student
- A logged-in user can delete a student record

---

## Schema

```
users
─────────────────────────────
user_id       SERIAL PRIMARY KEY
username      TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL

students
─────────────────────────────
student_id    SERIAL PRIMARY KEY
name          TEXT NOT NULL
user_id       INTEGER REFERENCES users(user_id) ON DELETE CASCADE

attendance_records
─────────────────────────────
record_id     SERIAL PRIMARY KEY
date          DATE NOT NULL DEFAULT CURRENT_DATE
is_present    BOOLEAN DEFAULT FALSE
student_id    INTEGER REFERENCES students(student_id) ON DELETE CASCADE
```

A user has many students. A student has many attendance records. Deleting a user cascades to delete all of their students, and deleting a student cascades to delete all of their attendance records.

---

## API Contract

### Auth Endpoints

| Method | Endpoint | Request Body | Response |
|--------|----------|--------------|----------|
| POST | `/api/auth/register` | `{ username, password }` | `{ user_id, username }` |
| POST | `/api/auth/login` | `{ username, password }` | `{ user_id, username }` |
| DELETE | `/api/auth/logout` | — | `{ message }` |
| GET | `/api/auth/me` | — | `{ user_id, username }` or `null` |

### Student Endpoints _(all require authentication)_

| Method | Endpoint | Request Body | Response |
|--------|----------|--------------|----------|
| GET | `/api/students` | — | `[{ student_id, name, user_id }]` |
| POST | `/api/students` | `{ name }` | `{ student_id, name, user_id }` |
| DELETE | `/api/students/:student_id` | — | `{ student_id, name, user_id }` |

### Attendance Endpoints _(all require authentication)_

| Method | Endpoint | Request Body | Response |
|--------|----------|--------------|----------|
| GET | `/api/attendance/:student_id` | — | `[{ record_id, date, is_present, student_id }]` |
| POST | `/api/attendance` | `{ student_id, date }` | `{ record_id, date, is_present, student_id }` |
| PATCH | `/api/attendance/:record_id` | `{ is_present }` | `{ record_id, date, is_present, student_id }` |
| DELETE | `/api/attendance/:record_id` | — | `{ record_id, date, is_present, student_id }` |

---

## Setup

### 1. Database

Create a local Postgres database:

```bash
createdb attendance_casestudy
```

### 2. Server

```bash
cd server
npm install
cp .env.template .env
```

Open `.env` and fill in your Postgres credentials and a session secret. Then seed the database:

```bash
npm run db:seed
```

Start the server:

```bash
npm run dev
```

The server runs on `http://localhost:8080`.

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`. The Vite dev proxy forwards all `/api` requests to the Express server so session cookies work correctly.

---

## Seed Users

After running `npm run db:seed`, these accounts are available:

| Username | Password |
|----------|----------|
| teacher1 | password123 |
| teacher2 | password123 |

---

## Application Structure

```
swe-casestudy-attendance-tracker/
├── frontend/                   # React app (Vite)
│   ├── src/
│   │   ├── App.jsx             # Root component: currentUser state, session rehydration, auth handlers
│   │   ├── adapters/
│   │   │   ├── auth-adapters.js        # Fetch adapters for /api/auth/* endpoints
│   │   │   ├── student-adapters.js     # Fetch adapters for /api/students/* endpoints
│   │   │   └── attendance-adapters.js  # Fetch adapters for /api/attendance/* endpoints
│   │   └── components/
│   │       ├── AuthPage.jsx            # Login + Register forms (shown when logged out)
│   │       ├── AttendancePage.jsx      # Main app container (shown when logged in)
│   │       ├── AddStudentForm.jsx      # Form to add a new student
│   │       ├── StudentList.jsx         # Renders a list of StudentItems
│   │       └── StudentItem.jsx         # Single student: name, present/absent toggle, delete button
│   └── vite.config.js          # Proxies /api requests to Express in development
└── server/                     # Express + Postgres API
    ├── index.js                 # App entry point, route definitions
    ├── controllers/
    │   ├── authControllers.js        # register, login, logout, getMe
    │   ├── studentControllers.js     # list, create, delete students
    │   └── attendanceControllers.js  # list, create, update, delete attendance records
    ├── models/
    │   ├── userModel.js          # SQL queries for the users table
    │   ├── studentModel.js       # SQL queries for the students table
    │   └── attendanceModel.js    # SQL queries for the attendance_records table
    ├── middleware/
    │   ├── checkAuthentication.js    # Blocks unauthenticated requests
    │   └── logRoutes.js              # Logs each incoming request
    └── db/
        ├── pool.js               # Postgres connection pool
        └── seed.js               # Creates tables and inserts sample data
```
