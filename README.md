# SkillUp — Mini Learning System (Next.js + MongoDB)

## Team Members
- Xavier (Project Lead) — https://github.com/cyon003
- Member 2 — https://github.com/<member2-username>
- Member 3 — https://github.com/<member3-username>

## Project Description
SkillUp is a mini learning platform built with **Next.js (App Router, JavaScript)** and **MongoDB**.  
It provides authentication, role-based access (admin/student), and REST API CRUD operations across 3 core entities:
- Users
- Courses
- Enrollments

The project is designed for VM deployment (no serverless requirement) and follows assignment constraints.

## Tech Stack
- Next.js 16 (App Router)
- React 19
- MongoDB + Mongoose
- JWT Auth (HttpOnly cookie)
- TailwindCSS
- Nginx + PM2 (for VM production)

## Roles and Permissions
### Student
- Register / Login
- View course catalog + search
- Enroll in courses
- View enrolled courses
- Unenroll from courses

### Admin
- Manage courses (Create / Read / Update / Delete)
- Manage users (Read / Update role / Delete)
- Manage enrollments (Read / Update progress / Delete)

## Data Models (3 CRUD Entities)
### 1) User
- Create: register student
- Read: admin list users
- Update: admin update user role
- Delete: admin delete user

### 2) Course
- Create: admin create course
- Read: authenticated users list/search courses
- Update: admin edit course
- Delete: admin delete course

### 3) Enrollment
- Create: student enroll in course
- Read: student own enrollments, admin all enrollments
- Update: admin update progress
- Delete: student unenroll / admin delete enrollment

## REST API Endpoints
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/seed-admin` (one-time admin seed)

### Courses
- `GET /api/courses?q=`
- `POST /api/courses` (admin)
- `GET /api/courses/:id`
- `PUT /api/courses/:id` (admin)
- `DELETE /api/courses/:id` (admin)

### Users
- `GET /api/users` (admin)
- `PUT /api/users/:id` (admin)
- `DELETE /api/users/:id` (admin)

Note: legacy internal routes `/api/user` and `/api/user/:id` are also available.

### Enrollments
- `GET /api/enrollments`
- `POST /api/enrollments`
- `PUT /api/enrollments/:id`
- `DELETE /api/enrollments/:id`

## Local Setup (Development)
### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment
Create/update `.env` in project root:
```env
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_random_secret>
```

### 3) Run development server
```bash
npm run dev
```

Open: `http://localhost:3000`

## Admin Bootstrap
Create first admin user (one-time):
```bash
curl -X POST http://localhost:3000/api/auth/seed-admin \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"admin123"}'
```

Then login with that admin account.

## Required Screenshots (for submission)
Place actual screenshots in:
- `public/screenshots/01-home.png`
- `public/screenshots/02-register.png`
- `public/screenshots/03-login.png`
- `public/screenshots/04-dashboard.png`
- `public/screenshots/05-courses.png`
- `public/screenshots/06-my-courses.png`
- `public/screenshots/07-admin-courses.png`
- `public/screenshots/08-admin-users.png`
- `public/screenshots/09-admin-enrollments.png`

## Production Deployment (VM)
### 1) Build app
```bash
npm run build
```

### 2) Start app with PM2
```bash
pm2 start npm --name skillup -- start
pm2 save
```

### 3) Reverse proxy with Nginx
Configure Nginx to proxy to Next.js app (default `localhost:3000`).

## Submission Checklist
- [ ] Working production URL on VM (no serverless)
- [ ] Source code on GitHub
- [ ] Complete README
- [ ] Screenshots in repo
- [ ] 5-minute demo video uploaded to YouTube (Unlisted)

