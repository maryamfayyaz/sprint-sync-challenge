# SprintSync Frontend

A modern, role-based task management application built with Next.js, TypeScript, and Tailwind CSS. SprintSync provides AI-powered task suggestions, drag-and-drop Kanban boards, analytics dashboards, and comprehensive user management.

## 🚀 Features

### Core Functionality
- **Role-Based Access Control**: Admin and user roles with different permissions
- **Task Management**: Create, edit, delete, and track tasks with time logging
- **Kanban Board**: Drag-and-drop interface for visual task management
- **AI Suggestions**: Get AI-powered task descriptions and recommendations
- **Analytics Dashboard**: Track productivity metrics and completion rates
- **User Management**: Admin panel for creating and managing users

### User Roles

#### Admin Users
- ✅ View all tasks in the system
- ✅ Access to Users management tab
- ✅ Create new users with role assignment
- ✅ Assign tasks to any user
- ✅ Delete any task
- ✅ Edit any task

#### Regular Users
- ✅ View only assigned tasks
- ✅ Edit own tasks
- ✅ Update task status
- ✅ View personal analytics

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Charts**: Recharts
- **Validation**: Zod
- **Icons**: Lucide React
- **Authentication**: JWT-based with custom hooks

## 📁 Project Structure

\`\`\`
sprintsync-frontend/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with providers
│   ├── loading.tsx              # Loading component
│   ├── page.tsx                 # Main dashboard
│   └── login/
│       └── page.tsx             # Login/register page
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   └── textarea.tsx
│   ├── admin-panel.tsx          # Admin user management
│   ├── ai-suggest-modal.tsx     # AI task suggestions
│   ├── analytics-chart.tsx      # Analytics dashboard
│   ├── create-task-modal.tsx    # Task creation form
│   ├── create-user-modal.tsx    # User creation form
│   ├── edit-task-modal.tsx      # Task editing form
│   ├── kanban-board.tsx         # Drag-and-drop board
│   ├── profile-view.tsx         # User profile and logs
│   ├── task-card.tsx            # Individual task component
│   └── task-list.tsx            # Task list view
├── hooks/                       # Custom React hooks
│   ├── use-auth.tsx             # Authentication context
│   └── use-toast.tsx            # Toast notifications
├── lib/                         # Utility libraries
│   ├── api-client.ts            # HTTP client with auth
│   ├── logger.ts                # Logging system
│   ├── utils.ts                 # Utility functions
│   └── validation.ts            # Zod schemas
├── types/                       # TypeScript definitions
│   └── task.ts                  # Task type definitions
└── README.md                    # This file
\`\`\`

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:3001`

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd sprintsync-frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Environment Setup

The application expects a backend API running on `http://localhost:3001`. Make sure your backend is configured with the following endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /tasks` - Get all tasks (admin)
- `GET /tasks/my-tasks` - Get user's tasks
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `PATCH /tasks/:id/status` - Update task status
- `DELETE /tasks/:id` - Delete task
- `GET /users` - Get all users (admin)
- `POST /users` - Create user (admin)
- `POST /ai/suggest` - AI task suggestions

## 🔐 Authentication

The application uses JWT-based authentication with the following flow:

1. **Login/Register**: Users authenticate via `/login` page
2. **Token Storage**: JWT tokens are stored in localStorage
3. **Auto-redirect**: Unauthenticated users are redirected to login
4. **Role-based UI**: Components render based on user role

### Auth Hook Usage

\`\`\`typescript
import { useAuth } from '@/hooks/use-auth'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Please log in</div>
  }
  
  return <div>Welcome, {user?.email}!</div>
}
\`\`\`

## 📋 Task Management

### Task Schema

Tasks follow this TypeScript interface:

\`\`\`typescript
interface Task {
  id: number
  title: string
  description: string
  status: "TODO" | "IN_PROGRESS" | "DONE"
  totalMinutes?: number
  assignedUserId?: number
  assignedUser?: {
    id: number
    email: string
    name?: string
  }
  createdAt?: string
  updatedAt?: string
}
\`\`\`

### Validation Schemas

**Create Task:**
\`\`\`typescript
const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  totalMinutes: z.number().min(0, "Total minutes must be 0 or greater"),
})
\`\`\`

**Update Task:**
\`\`\`typescript
const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  totalMinutes: z.number().min(0, "Total minutes must be 0 or greater").optional(),
})
\`\`\`

## 🎨 UI Components

The application uses shadcn/ui components for consistent design:

### Key Components

- **KanbanBoard**: Drag-and-drop task management
- **TaskCard**: Individual task display with actions
- **AnalyticsChart**: Productivity metrics and charts
- **AdminPanel**: User management interface
- **Modals**: Task creation, editing, and AI suggestions

### Styling

- **Framework**: Tailwind CSS
- **Design System**: shadcn/ui
- **Responsive**: Mobile-first design
- **Dark Mode**: Ready (can be implemented)

## 📊 Analytics

The analytics dashboard provides:

- **Task Metrics**: Total, completed, completion rate
- **Time Tracking**: Hours logged per day
- **Status Distribution**: Pie chart of task statuses
- **Recent Activity**: Latest task updates

### Chart Components

\`\`\`typescript
import { AnalyticsChart } from '@/components/analytics-chart'

<AnalyticsChart tasks={tasks} />
\`\`\`

## 🤖 AI Integration

AI-powered task suggestions help users create better task descriptions:

\`\`\`typescript
// AI Suggest Modal
<AISuggestModal 
  open={aiModalOpen} 
  onOpenChange={setAiModalOpen} 
/>
\`\`\`

The AI feature calls the backend `/ai/suggest` endpoint with a task title and returns an enhanced description.

## 🔧 API Client

The application includes a robust API client with:

- **Authentication**: Automatic JWT token handling
- **Error Handling**: Standardized error responses
- **Logging**: Request/response logging
- **Auto-redirect**: Handles 401 unauthorized responses

### Usage Example

\`\`\`typescript
import { apiClient } from '@/lib/api-client'

// GET request
const tasks = await apiClient.get('/tasks')

// POST request
const newTask = await apiClient.post('/tasks', {
  title: 'New Task',
  description: 'Task description',
  totalMinutes: 60
})

// PUT request
await apiClient.put(`/tasks/${id}`, updateData)

// DELETE request
await apiClient.delete(`/tasks/${id}`)
\`\`\`

## 📝 Logging

Comprehensive logging system for debugging and monitoring:

\`\`\`typescript
import { logger } from '@/lib/logger'

// API calls
logger.apiCall('GET', '/tasks')
logger.apiSuccess('GET', '/tasks', responseTime)
logger.apiError('GET', '/tasks', error)

// General logging
logger.info('User action', { userId: 1 })
logger.warn('Warning message', data)
logger.error('Error occurred', error)
\`\`\`

## 🧪 Development

### Code Organization

- **Components**: Reusable UI components in `/components`
- **Hooks**: Custom React hooks in `/hooks`
- **Types**: TypeScript definitions in `/types`
- **Utils**: Helper functions in `/lib`
- **Validation**: Zod schemas in `/lib/validation.ts`

### Best Practices

1. **TypeScript**: Strict typing for all components
2. **Validation**: Zod schemas for all forms
3. **Error Handling**: Comprehensive error boundaries
4. **Accessibility**: ARIA labels and semantic HTML
5. **Performance**: Optimistic updates and loading states

### Adding New Features

1. **Create Component**: Add to `/components`
2. **Define Types**: Update `/types` if needed
3. **Add Validation**: Create Zod schema
4. **Update API**: Add client methods
5. **Test**: Verify functionality

## 🚀 Deployment

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

### Environment Variables

Create `.env.local` for environment-specific settings:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3001
\`\`\`

### Deployment Platforms

- **Vercel**: Recommended for Next.js apps
- **Netlify**: Alternative static hosting
- **Docker**: Container deployment

## 🐛 Troubleshooting

### Common Issues

1. **Import Errors**: Don't include `.tsx` extensions in imports
2. **Auth Issues**: Check backend API is running on port 3001
3. **CORS Errors**: Ensure backend allows frontend origin
4. **Build Errors**: Check TypeScript types and imports

### Debug Mode

Enable detailed logging in development:

\`\`\`typescript
// Check browser console for API logs
// Use React DevTools for component inspection
// Check Network tab for API requests
\`\`\`

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Commit** your changes
4. **Push** to the branch
5. **Create** a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing component patterns
- Add proper error handling
- Include JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

1. Check this documentation
2. Review the code comments
3. Check browser console for errors
4. Verify backend API is running
5. Create an issue in the repository

---

**Built with ❤️ using Next.js, TypeScript, and shadcn/ui**

