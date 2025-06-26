# API Documentation

This document describes the REST API endpoints used by the SprintSync frontend application.

## Base URL

\`\`\`
http://localhost:3001
\`\`\`

## Authentication

The API uses JWT (JSON Web Token) based authentication. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer `<your-jwt-token>`
\`\`\`

## Error Handling

All API endpoints return consistent error responses:

\`\`\`json
{
  "error": true,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
\`\`\`

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Endpoints

### Authentication

#### POST /auth/login

Authenticate user and receive JWT token.

**Request:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "isAdmin": false
  }
}
\`\`\`

**Frontend Implementation:**
\`\`\`typescript
const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  localStorage.setItem('token', response.token);
  return response;
};
\`\`\`

#### POST /auth/register

Register a new user account.

**Request:**
\`\`\`json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "isAdmin": false
  }
}
\`\`\`

### Tasks

#### GET /tasks

Fetch tasks based on user role.

- **Admin**: Returns all tasks in the system
- **User**: Returns only tasks assigned to the user

**Response:**
\`\`\`json
[
  {
    "id": 1,
    "title": "Complete project setup",
    "description": "Set up the initial project structure and dependencies",
    "status": "TODO",
    "totalMinutes": 120,
    "assignedUserId": 1,
    "assignedUser": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    },
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
]
\`\`\`

**Frontend Implementation:**
\`\`\`typescript
const fetchTasks = async () => {
  const endpoint = user?.isAdmin ? '/tasks' : '/tasks/my-tasks';
  const tasks = await apiClient.get(endpoint);
  return tasks;
};
\`\`\`

#### GET /tasks/my-tasks

Fetch tasks assigned to the current user.

**Response:** Same as GET /tasks but filtered for current user.

#### POST /tasks

Create a new task.

**Request:**
\`\`\`json
{
  "title": "New task title",
  "description": "Task description",
  "totalMinutes": 60,
  "assignedUserId": 1
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 2,
  "title": "New task title",
  "description": "Task description",
  "status": "TODO",
  "totalMinutes": 60,
  "assignedUserId": 1,
  "createdAt": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}
\`\`\`

**Frontend Implementation:**
\`\`\`typescript
const createTask = async (taskData: CreateTaskInput) => {
  const validatedData = createTaskSchema.parse(taskData);
  const task = await apiClient.post('/tasks', validatedData);
  return task;
};
\`\`\`

#### PUT /tasks/:id

Update an existing task.

**Request:**
\`\`\`json
{
  "title": "Updated task title",
  "description": "Updated description",
  "totalMinutes": 90,
  "assignedUserId": 2
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 1,
  "title": "Updated task title",
  "description": "Updated description",
  "status": "TODO",
  "totalMinutes": 90,
  "assignedUserId": 2,
  "updatedAt": "2024-01-15T12:00:00Z"
}
\`\`\`

#### PATCH /tasks/:id/status

Update task status only.

**Request:**
\`\`\`json
{
  "status": "IN_PROGRESS"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 1,
  "status": "IN_PROGRESS",
  "updatedAt": "2024-01-15T12:30:00Z"
}
\`\`\`

**Frontend Implementation:**
\`\`\`typescript
const updateTaskStatus = async (id: number, status: string) => {
  await apiClient.patch(`/tasks/${id}/status`, { status });
  // Optimistic update in UI
  setTasks(prev => prev.map(task =>
    task.id === id ? { ...task, status } : task
  ));
};
\`\`\`

#### DELETE /tasks/:id

Delete a task (Admin only).

**Response:** `204 No Content`

### Users (Admin Only)

#### GET /users

Fetch all users in the system.

**Response:**
\`\`\`json
[
  {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "isAdmin": false,
    "createdAt": "2024-01-15T09:00:00Z"
  },
  {
    "id": 2,
    "email": "admin@example.com",
    "name": "Admin User",
    "isAdmin": true,
    "createdAt": "2024-01-15T09:00:00Z"
  }
]
\`\`\`

#### POST /users

Create a new user (Admin only).

**Request:**
\`\`\`json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "isAdmin": false
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 3,
  "email": "newuser@example.com",
  "name": "New User",
  "isAdmin": false,
  "createdAt": "2024-01-15T13:00:00Z"
}
\`\`\`

### AI Integration

#### POST /ai/suggest

Get AI-powered task description suggestions.

**Request:**
\`\`\`json
{
  "title": "Setup database"
}
\`\`\`

**Response:**
\`\`\`json
{
  "description": "Set up the database schema, configure connection settings, create initial tables for users and tasks, and implement basic CRUD operations. Include proper indexing for performance and set up backup procedures."
}
\`\`\`

**Frontend Implementation:**
\`\`\`typescript
const getAISuggestion = async (title: string) => {
  const response = await apiClient.post('/ai/suggest', { title });
  return response.description;
};
\`\`\`

### Statistics (Admin Only)

#### GET /stats/top-users

Get top performing users statistics.

**Response:**
\`\`\`json
[
  {
    "userId": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "totalTasks": 15,
    "completedTasks": 12,
    "totalMinutes": 1440
  }
]
\`\`\`

## Frontend API Client

The frontend uses a centralized API client for all HTTP requests:

\`\`\`typescript
// lib/api-client.ts
class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async post(endpoint: string, data?: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse(response);
  }

  // ... other methods
}

export const apiClient = new ApiClient();
\`\`\`

## Error Handling

The frontend implements comprehensive error handling:

\`\`\`typescript
const handleApiError = (error: any) => {
  if (error.response?.status === 401) {
    // Redirect to login
    localStorage.removeItem('token');
    router.push('/login');
  } else {
    // Show user-friendly error message
    toast({
      title: 'Error',
      description: error.message || 'Something went wrong',
      variant: 'destructive',
    });
  }

  // Log error for debugging
  logger.error('API Error', error);
};
\`\`\`

## Request/Response Logging

All API requests are logged for debugging:

\`\`\`typescript
// Before request
logger.apiCall('GET', '/tasks');
const startTime = Date.now();

// After response
const responseTime = Date.now() - startTime;
logger.apiSuccess('GET', '/tasks', responseTime);

// On error
logger.apiError('GET', '/tasks', error, responseTime);
\`\`\`

## Rate Limiting

The API implements rate limiting:

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **Admin endpoints**: 200 requests per minute

## Security Considerations

1. **Token Storage**: JWT tokens are stored in localStorage (consider httpOnly cookies for production)
2. **Token Expiration**: Implement automatic token refresh
3. **HTTPS**: Always use HTTPS in production
4. **Input Validation**: All inputs are validated on both client and server
5. **CORS**: Configure CORS properly for your domain

## Testing API Endpoints

Use the following curl commands to test endpoints:

\`\`\`bash

# Login

curl -X POST http://localhost:3001/auth/login 
  -H "Content-Type: application/json" 
  -d '{"email":"demo@example.com","password":"password"}'

# Get tasks (with token)

curl -X GET http://localhost:3001/tasks 
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create task

curl -X POST http://localhost:3001/tasks 
  -H "Authorization: Bearer YOUR_JWT_TOKEN" 
  -H "Content-Type: application/json" 
  -d '{"title":"Test Task","description":"Test Description","totalMinutes":60}'
\`\`\`

---

For more information about the backend API implementation, refer to the backend documentation.
