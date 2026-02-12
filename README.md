# Task Tracker - Preskilet Intern Assignment

A full-stack task management application built with **Vue.js 3**, **Node.js**, **Express**, and **MongoDB**.

##     Features

### Core Features (Required)
   **Task CRUD Operations**
- Create new tasks
- View all tasks
- Update task details (title, description, status)
- Delete tasks

   **Task Fields**
- Title (required)
- Description (optional)
- Status (TODO | IN_PROGRESS | DONE)
- CreatedAt (auto-generated)
- UpdatedAt (auto-generated)

   **Filters & Sorting**
- Filter by status
- Sort by latest created
- Sort by title
- Ascending/Descending order

### Bonus Features (Implemented)
   **Search by Title** - Real-time search with debouncing
   **Pagination** - 10 tasks per page with navigation
   **JWT Authentication** - Secure user authentication
   **Task Statistics** - Visual dashboard with task counts
   **Responsive Design** - Mobile-friendly UI

##  Architecture

### Backend Structure
```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── validators/      # Input validation
│   └── server.js        # Express app setup
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/      # Reusable Vue components
│   ├── views/           # Page components
│   ├── services/        # API services
│   ├── composables/     # Composition API logic
│   ├── store/           # Pinia state management
│   └── router/          # Vue Router config
```

##  Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or Atlas URI)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task-tracker
```

### 2. Backend Setup

```bash
cd backend


npm install


cp .env.example .env

# Edit .env with your configuration
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/task-tracker
# JWT_SECRET=your_super_secret_key
# JWT_EXPIRE=7d
# NODE_ENV=development
```

**Start MongoDB** (if running locally):
```bash
mongod
```

**Start Backend Server**:
```bash

npm run dev


npm start
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend


npm install


npm run dev
```

Frontend will run on `http://localhost:5173`

##  API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/profile     - Get user profile (protected)
```

### Tasks (All protected routes)
```
POST   /api/tasks            - Create new task
GET    /api/tasks            - Get all tasks (with filters)
GET    /api/tasks/:id        - Get single task
PUT    /api/tasks/:id        - Update task
DELETE /api/tasks/:id        - Delete task
GET    /api/tasks/stats      - Get task statistics
```

### Query Parameters for GET /api/tasks
```
status   - Filter by status (TODO, IN_PROGRESS, DONE)
search   - Search by title
page     - Page number (default: 1)
limit    - Tasks per page (default: 10)
sortBy   - Sort field (createdAt, updatedAt, title)
order    - Sort order (asc, desc)
```

##  Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework (Composition API)
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

##  Security Features

1. **Password Hashing** - Bcrypt with salt rounds
2. **JWT Authentication** - Secure token-based auth
3. **Input Validation** - Server-side validation with express-validator
4. **Error Handling** - Centralized error handling middleware
5. **CORS Protection** - Configured CORS policies
6. **Authentication Guards** - Protected routes on frontend and backend

##  Database Schema

### User Model
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  password: String (required, hashed, min 6 chars),
  createdAt: Date (auto)
}
```

### Task Model
```javascript
{
  title: String (required, 3-100 chars),
  description: String (optional, max 500 chars),
  status: Enum ['TODO', 'IN_PROGRESS', 'DONE'],
  user: ObjectId (ref: User),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

##  Key Implementation Details

### 1. Proper Folder Structure
- **Controllers** handle HTTP requests
- **Services** contain business logic
- **Models** define data schemas
- **Validators** validate input
- **Middleware** for cross-cutting concerns

### 2. Error Handling
- Custom error handler middleware
- Validation error formatting
- MongoDB error handling (duplicate keys, cast errors)
- JWT error handling
- User-friendly error messages

### 3. Validation
- **Frontend**: Real-time form validation
- **Backend**: Express-validator for all inputs
- **Database**: Mongoose schema validation

### 4. API Best Practices
- RESTful endpoints
- Proper HTTP status codes
- Consistent response format
- Pagination metadata
- Query parameter validation

### 5. Frontend Best Practices
- Composition API for reusable logic
- Component-based architecture
- Proper state management with Pinia
- Route guards for authentication
- Responsive design
- Loading states and error handling

## Testing the Application

### 1. Register a New User
- Go to `http://localhost:5173/register`
- Fill in name, email, password
- Submit the form

### 2. Login
- Go to `http://localhost:5173/login`
- Enter your credentials
- You'll be redirected to the dashboard

### 3. Create Tasks
- Click "Add Task" button
- Fill in task details
- Select status
- Submit

### 4. Test Filters
- Use the search box to search by title
- Filter by status (TODO, IN_PROGRESS, DONE)
- Change sort order
- Test pagination

### 5. Edit/Delete Tasks
- Click edit icon to modify a task
- Click delete icon to remove a task

##  Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1200px)
- Mobile (320px - 768px)

##  Development Guidelines

### Running in Development
```bash

cd backend
npm run dev


cd frontend
npm run dev
```

### Building for Production
```bash

cd frontend
npm run build


cd backend
npm start
```

##  Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

##  Submission Checklist

   Vue.js Composition API used throughout
   Proper component structure
   State management with Pinia
   API integration with Axios
   Form validation on frontend

   Express.js with proper folder structure
   Routes/Controllers/Services separation
   Validation with express-validator
   Comprehensive error handling
   Clean, readable code

   Mongoose models with validation
   Proper schema design
   Indexes for performance
   Query optimization

   All required APIs implemented
   Filtering and sorting
   Pagination
   Search functionality
   JWT authentication

   Clean, modern design
   Fully responsive
   Intuitive UX
   Loading states
   Error messages

##  Author
**Aman**
- Preskilet Intern Assignment
- Full Stack Developer

## 📄 License


