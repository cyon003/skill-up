# SkillUp — Mini Learning System (Next.js + MongoDB)

## Team Members
- Xavier (Project Lead) — https://github.com/cyon003
- Aung Myint Myat(6611906) — https://github.com/Jake21Ryan
- Member 3 — https://github.com/<member3-username>

> (No student IDs required)

---

## Project Description
SkillUp is a mini learning platform built with **Next.js (JavaScript)** and **MongoDB**.
It supports authentication, course management, and student enrollments using **REST API CRUD** operations across **three data models**:
- Users
- Courses
- Enrollments

The system includes separate capabilities for **Admin** and **Student** roles and is deployed on a **VM** (no serverless).

---

## Tech Stack
- Next.js (App Router) — JavaScript
- MongoDB (Self-hosted on VM / local)
- Mongoose (ODM)
- JWT Authentication (stored in HttpOnly Cookie)
- TailwindCSS (UI styling)
- Nginx (reverse proxy on VM)
- PM2 (Node process manager)

---

## User Roles
### Student
- Register / Login
- View course catalog
- Enroll in a course
- View enrolled courses (My Courses)
- Unenroll from a course

### Admin
- Manage courses (Create / Read / Update / Delete)
- Manage users (Read / Update role / Delete)
- Manage enrollments (Read / Update progress / Delete)

---

## Data Models (3 CRUD Entities)
### 1) User
- Create: Register
- Read: Admin view users
- Update: Admin change role (student/admin)
- Delete: Admin delete user

### 2) Course
- Create: Admin add course
- Read: Student course list + search
- Update: Admin edit course
- Delete: Admin delete course

### 3) Enrollment
- Create: Student enroll course
- Read: Student “My Courses” / Admin view all enrollments
- Update: Admin update progress (optional feature)
- Delete: Student unenroll / Admin delete enrollment

---

## REST API Endpoints
### Auth
- `POST /api/auth/register` — create student user
- `POST /api/auth/login` — login and set cookie token
- `POST /api/auth/logout` — clear cookie token
- `POST /api/auth/seed-admin` — create initial admin user (one-time)

### Courses (Admin CRUD + Student Read)
- `GET /api/courses?q=` — list/search courses
- `POST /api/courses` — create course (admin)
- `GET /api/courses/:id` — read course
- `PUT /api/courses/:id` — update course (admin)
- `DELETE /api/courses/:id` — delete course (admin)

### Users (Admin CRUD)
- `GET /api/users` — list users (admin)
- `PUT /api/users/:id` — update user (admin)
- `DELETE /api/users/:id` — delete user (admin)

### Enrollments (CRUD)
- `GET /api/enrollments` — list enrollments (admin: all, student: own)
- `POST /api/enrollments` — enroll (student)
- `PUT /api/enrollments/:id` — update progress (admin) / allowed owner update if enabled
- `DELETE /api/enrollments/:id` — unenroll / delete

---

## Screenshots (Required)
> Replace these with real screenshots and commit to GitHub in `/public/screenshots/`

- Home page  
  `public/screenshots/01-home.png`
- Register  
  `public/screenshots/02-register.png`
- Login  
  `public/screenshots/03-login.png`
- Dashboard  
  `public/screenshots/04-dashboard.png`
- Courses list + search  
  `public/screenshots/05-courses.png`
- My Courses  
  `public/screenshots/06-my-courses.png`
- Admin: Courses CRUD  
  `public/screenshots/07-admin-courses.png`
- Admin: Users management  
  `public/screenshots/08-admin-users.png`
- Admin: Enrollments management  
  `public/screenshots/09-admin-enrollments.png`

---

## Local Setup (Development)
### 1) Install dependencies
```bash
npm install
