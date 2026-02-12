# Quick Start Guide - Task Tracker

## Fast Setup

### Step 1: Install MongoDB
If you don't have MongoDB installed:
- **Windows**: Download from https://www.mongodb.com/try/download/community
- **Mac**: `brew install mongodb-community`
- **Linux**: `sudo apt-get install mongodb`

Start MongoDB:
```bash
mongod
```

### Step 2: Backend Setup
```bash
cd backend
npm install
npm run dev
```

Backend should be running on http://localhost:5000

### Step 3: Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend should be running on http://localhost:5173

### Step 4: Test the Application
1. Open browser: http://localhost:5173
2. Register a new account
3. Login and start creating tasks!

##   Default Test Account
After setup, create your own account via the register page.

##   Features to Test

### Basic CRUD
-   Create task (click "Add Task")
-   View tasks (automatically loads)
-   Edit task (click edit icon)
-   Delete task (click delete icon)

### Filters & Search
-   Search by title (type in search box)
-   Filter by status (TODO, IN_PROGRESS, DONE)
-   Sort by date/title
-   Change sort order (asc/desc)

### Pagination
-   Navigate between pages
-   See page numbers
-   10 tasks per page

### Authentication
-   Register new user
-   Login
-   Logout
-   Protected routes

##  Troubleshooting

### MongoDB Not Running?
```bash


brew services start mongodb-community
```

### Port Already in Use?
Change ports in .env files:
- Backend: `backend/.env` → PORT=5001
- Frontend: `frontend/.env` → VITE_API_URL=http://localhost:5001/api

### Dependencies Issue?
```bash

rm -rf node_modules package-lock.json
npm install
```

##  API Testing with Postman/Thunder Client

### 1. Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Copy the token from response.

### 3. Create Task
```
POST http://localhost:5000/api/tasks
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "My First Task",
  "description": "This is a test task",
  "status": "TODO"
}
```

### 4. Get All Tasks
```
GET http://localhost:5000/api/tasks
Authorization: Bearer YOUR_TOKEN_HERE
```

### 5. Get Tasks with Filters
```
GET http://localhost:5000/api/tasks?status=TODO&page=1&limit=10&sortBy=createdAt&order=desc
Authorization: Bearer YOUR_TOKEN_HERE
```

## Video Recording Checklist

Record these sections:

1. **Introduction** (30 sec)
   - Show project name and structure
   - Quick overview

2. **Folder Structure** (1 min)
   - Backend organization
   - Frontend components
   - Explain separation of concerns

3. **Database & Models** (1 min)
   - Show MongoDB connection
   - Explain User and Task models
   - Show validation

4. **API Flow** (2 min)
   - Route → Controller → Service → Model
   - Show one complete flow (create task)
   - Explain error handling

5. **Frontend Demo** (2 min)
   - Register/Login
   - Create tasks
   - Edit/Delete
   - Filters and search
   - Pagination

6. **Validation & Error Handling** (1 min)
   - Show validation errors
   - Backend validation
   - Frontend validation
   - Error messages

7. **Conclusion** (30 sec)
   - Recap features
   - Thank you



##  Production Deployment Notes

For production deployment:
1. Update MongoDB URI in .env
2. Use strong JWT secret
3. Set NODE_ENV=production
4. Build frontend: `npm run build`
5. Deploy backend to services like Render, Railway, or AWS
6. Deploy frontend to Vercel, Netlify, or Cloudflare Pages

