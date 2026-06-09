# ProManage Backend

A Node.js Express backend API for the ProManage project management application.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

## Installation

1. Navigate to the backend directory:
   
```
bash
   cd backend
   
```

2. Install dependencies:
   
```
bash
   npm install
   
```

3. Configure environment variables:
   - Copy `.env.example` to `.env` (or use the already provided `.env` file).
   - Set the `GEMINI_API_KEY` to your Google Gemini API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Update `MONGODB_URI` if using a cloud MongoDB instance.

## Running the Backend

### Development Mode
```
bash
npm run dev
```

### Production Mode
```
bash
npm start
```

The server will run on `http://localhost:5000`

## Seeding the Database

To populate the database with sample data:
```
bash
npm run seed
```

This will create:
- 10 sample users
- 5 sample projects
- 10 sample tasks

### Default Login Credentials

| Email | Password | Employee ID | Role |
|-------|----------|-------------|------|
| suresh@company.com | password123 | EMP001 | Project Manager |
| arun@company.com | password123 | EMP002 | Senior Developer |
| priya@company.com | password123 | EMP003 | UI/UX Designer |
| kumar@company.com | password123 | EMP004 | Backend Developer |
| anitha@company.com | password123 | EMP005 | DevOps Engineer |
| vijay@company.com | password123 | EMP006 | QA Engineer |
| divya@company.com | password123 | EMP007 | Frontend Developer |
| raghav@company.com | password123 | EMP008 | Data Analyst |
| kavitha@company.com | password123 | EMP009 | Product Owner |
| mohan@company.com | password123 | EMP010 | Security Engineer |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Update password

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/tasks` - Get project tasks

### Tasks
- `GET /api/tasks` - Get all tasks (optional: ?projectId=xxx)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status

## Technology Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Token (JWT) for authentication
- bcryptjs for password hashing
