# Dev Portal — Internal Developer Platform

<<<<<<< HEAD
A modern React-based **Internal Developer Platform (IDP)** built as part of a full-stack training program. This project focuses on learning modern frontend development, authentication concepts, routing, state management, and API integration while following a scalable project structure.

## Features

* User Login page
* User Registration page
* Dashboard interface
* Protected routes
* Mock OAuth/OIDC login flow
* Responsive UI
* Built with React and Vite
* Production-ready build configuration

---

## Tech Stack

| Technology        | Purpose                           |
| ----------------- | --------------------------------- |
| React             | Frontend library                  |
| Vite              | Build tool and development server |
| React Router      | Client-side routing               |
| JavaScript (ES6+) | Application logic                 |
| HTML5             | Page structure                    |
| CSS3              | Styling and responsive layout     |

---

## Project Structure

```text
src/
│
├── assets/
├── components/
├── pages/
├── layouts/
├── context/
├── services/
├── hooks/
├── utils/
│
├── App.jsx
└── main.jsx
```

---

## Authentication Flow

The project demonstrates the UI flow for authentication, including:

* User Login
* User Registration
* Protected Dashboard
* Mock OAuth/OIDC Sign In

> **Note:** OAuth/OIDC authentication is currently mocked for learning purposes and does not connect to a real Identity Provider.

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/AnanyaDevGo/dev-platform.git
```

### Navigate to the project

```bash
cd dev-platform
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:4173
```

---

## Build for Production

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Learning Objectives

This project was built to gain practical experience with:

* HTML5 and CSS3 fundamentals
* Responsive web design
* Modern React development
* Components and JSX
* Props and State
* React Hooks
* React Router
* Context API
* Protected Routes
* Authentication vs Authorization
* OAuth 2.0 and OpenID Connect (OIDC) concepts
* API integration
* Project organization and reusable components

---

## Current Status

Completed:

* Responsive landing page
* Login page
* Registration page
* Dashboard UI
* Routing
* Protected routes
* Mock authentication flow
---

## Screenshots

You can add screenshots here as the project evolves.

```
docs/
├── home.png
├── login.png
├── register.png
└── dashboard.png
```

---

## Author

**Ananya E P**

GitHub: https://github.com/AnanyaDevGo

---

## License

This project is created for learning and educational purposes.
=======
Full-stack training project: React frontend + FastAPI backend + PostgreSQL + Redis.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Zustand, React Router |
| Backend | FastAPI, SQLAlchemy, Alembic |
| Database | PostgreSQL |
| Cache | Redis |

## Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL running locally
- Redis running locally (optional; app degrades gracefully without it)

## Quick start (Windows)

### Step 0 — Install Python (if `python` is not found)

```powershell
winget install Python.Python.3.12 --accept-package-agreements --accept-source-agreements
```

Then **close and reopen PowerShell** so `python` is on your PATH.

Also disable the Microsoft Store alias:  
**Settings → Apps → Advanced app settings → App execution aliases → turn OFF `python.exe` and `python3.exe`**

### Step 1 — Install PostgreSQL

Install PostgreSQL 16 and remember the password you set for the `postgres` user:

```powershell
winget install PostgreSQL.PostgreSQL.16 --accept-package-agreements --accept-source-agreements
```

Create the database (adjust password if needed):

```powershell
psql -U postgres -c "CREATE DATABASE dev_portal;"
```

Update `server/.env` if your PostgreSQL password is not `password`:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/dev_portal
```

### Step 2 — Backend setup

You are already in the project. Run these **once**:

```powershell
cd "C:\Users\AnanyaPradeep\OneDrive - MULTICOREWARE\Fullstack training Project\server"
.\setup.ps1
```

Or manually:

```powershell
cd server
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
python scripts\seed.py
uvicorn app.main:app --reload --port 4000
```

Default admin after seed: `admin@example.com` / `Admin1234`

### Step 3 — Frontend

Open a **new** terminal from the project root:

```powershell
cd "C:\Users\AnanyaPradeep\OneDrive - MULTICOREWARE\Fullstack training Project"
npm install
npm run dev
```

Open http://localhost:5173

### Step 4 — Production build (Week 1 deliverable)

```powershell
npm run build
npm run preview
```

## API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check (DB + Redis status) |
| POST | `/auth/login` | Login |
| POST | `/auth/register` | Register |
| GET | `/auth/me` | Current user |
| GET | `/auth/oauth/complete` | Mock OAuth completion |
| GET/POST/PATCH/DELETE | `/api/users` | User management (admin) |
| GET/POST/PATCH/DELETE | `/api/projects` | Project management |
| GET/POST | `/api/audit-logs` | Audit logs (admin read) |

## Project structure

```
src/           React frontend
server/
  app/         FastAPI application
  alembic/     Database migrations
  scripts/     Seed scripts
```

## Training plan alignment

- **Week 1:** React portal with login, registration, dashboard, protected routes, OAuth UI
- **Week 2:** FastAPI + PostgreSQL + Redis with full CRUD APIs and frontend integration
- **Week 3:** Real auth (OAuth IDP), Prometheus, pytest
- **Week 4:** Nginx, Gunicorn/Uvicorn, deployment runbook
>>>>>>> 7aedd97 (Added project backend)
