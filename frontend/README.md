# SprintSync Frontend

A modern, AI-powered task management application built with Next.js, TypeScript, and Tailwind CSS. SprintSync helps fast-moving teams organize, track, and complete tasks efficiently with intelligent suggestions and comprehensive analytics.

### 🔗 Live URL

Visit the live version of the app here: [https://sprint-sync-challenge-1.onrender.com](https://sprint-sync-challenge-1.onrender.com)

## 🚀 Features

### Core Features

- **Task Management**: Create, edit, delete, and organize tasks with drag-and-drop Kanban boards
- **AI-Powered Suggestions**: Get intelligent task descriptions using AI
- **Role-Based Access Control**: Admin and user roles with different permissions
- **Real-Time Updates**: Instant task status updates and notifications
- **Analytics Dashboard**: Comprehensive charts and metrics for productivity tracking
- **Time Tracking**: Log and monitor time spent on tasks
- **User Management**: Admin panel for managing users and permissions

### Technical Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Ready**: Built with theme support (easily extensible)
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Form Validation**: Zod-based validation for all forms
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Logging System**: Built-in logging for debugging and monitoring
- **Authentication**: JWT-based authentication with automatic token refresh

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Charts**: Recharts
- **Icons**: Lucide React
- **Validation**: Zod
- **HTTP Client**: Native Fetch API
- **State Management**: React Hooks + Context API

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:3001` (see backend documentation)

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone `<repository-url>`
cd sprintsync-frontend
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install

# or

yarn install
\`\`\`

### 3. Environment Setup

Create a `.env.local` file in the root directory:
\`\`\`env

# API Configuration

NEXT_PUBLIC_API_URL=http://localhost:3001

# Optional: Analytics and Monitoring

NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
\`\`\`

### 4. Start Development Server

\`\`\`bash
npm run dev

# or

yarn dev
\`\`\`

Visit `http://localhost:3000` to see the application.

### 5. Build for Production

\`\`\`bash
npm run build
npm start

# or

yarn build
yarn start
\`\`\`

## 👥 User Roles & Permissions

### Admin Users

- ✅ View all tasks in the system
- ✅ Create tasks and assign to any user
- ✅ Edit any task
- ✅ Delete any task
- ✅ Access user management panel
- ✅ Create new users
- ✅ View system analytics
- ✅ Access admin-only features

### Regular Users

- ✅ View tasks assigned to them
- ✅ Create new tasks (assigned to themselves)
- ✅ Edit their own tasks
- ✅ Update task status (TODO → IN_PROGRESS → DONE)
- ✅ View personal analytics
- ✅ Use AI suggestions

## 📁 Project Structure

\`\`\`
sprintsync-frontend/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Dashboard page
│   ├── login/                   # Authentication pages
│   └── loading.tsx              # Loading component
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── ai-suggest-modal.tsx     # AI suggestion modal
│   ├── analytics-chart.tsx      # Analytics dashboard
│   ├── admin-panel.tsx          # Admin user management
│   ├── kanban-board.tsx         # Drag-and-drop board
│   ├── task-card.tsx            # Individual task cards
│   ├── create-task-modal.tsx    # Task creation modal
│   ├── edit-task-modal.tsx      # Task editing modal
│   └── profile-view.tsx         # User profile component
├── hooks/                       # Custom React hooks
│   ├── use-auth.tsx             # Authentication hook
│   └── use-toast.tsx            # Toast notifications
├── lib/                         # Utility libraries
│   ├── api-client.ts            # API client wrapper
│   ├── logger.ts                # Logging system
│   ├── utils.ts                 # General utilities
│   └── validation.ts            # Zod schemas
├── types/                       # TypeScript type definitions
│   └── task.ts                  # Task-related types
└── docs/                        # Documentation
    ├── API.md                   # API documentation
    ├── COMPONENTS.md            # Component documentation
    └── DEPLOYMENT.md            # Deployment guide
\`\`\`

## 🔧 Development

### Code Style

- Use TypeScript for all new files
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Implement proper error boundaries
- Add proper TypeScript types for all props and functions

### Component Guidelines

- Keep components small and focused
- Use composition over inheritance
- Implement proper accessibility (ARIA labels, keyboard navigation)
- Follow the established naming conventions
- Add proper JSDoc comments for complex functions

### State Management

- Use React Context for global state (auth, theme)
- Use local state (useState) for component-specific state
- Implement proper error handling in all async operations
- Use custom hooks for reusable logic

## 🧪 Testing

\`\`\`bash

# Run tests

npm test

# Run tests in watch mode

npm run test:watch

# Run tests with coverage

npm run test:coverage
\`\`\`

## 📦 Building

\`\`\`bash

# Build for production

npm run build

# Analyze bundle size

npm run analyze

# Type check

npm run type-check

# Lint code

npm run lint

# Format code

npm run format
\`\`\`

## 🚀 Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions for various platforms.

### Quick Deploy to Vercel

\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

## 🔍 API Integration

The frontend integrates with a REST API backend. See [API.md](./docs/API.md) for complete API documentation.

### Key Endpoints

- `POST /auth/login` - User authentication
- `GET /tasks` - Fetch tasks (admin: all, user: assigned)
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task (admin only)
- `GET /users` - Fetch users (admin only)

## 🎨 UI Components

Built with shadcn/ui components for consistency and accessibility. See [COMPONENTS.md](./docs/COMPONENTS.md) for detailed component documentation.

### Key Components

- **KanbanBoard**: Drag-and-drop task management
- **TaskCard**: Individual task display with actions
- **AnalyticsChart**: Data visualization with Recharts
- **AISuggestModal**: AI-powered task suggestions
- **AdminPanel**: User management interface

## 🔐 Security

- JWT token-based authentication
- Automatic token refresh
- Role-based access control
- Input validation with Zod
- XSS protection
- CSRF protection
- Secure HTTP headers

## 📊 Analytics & Monitoring

- Built-in logging system
- Error tracking ready (Sentry integration)
- Performance monitoring
- User activity tracking
- Task completion metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

1. Ensure all tests pass
2. Follow the code style guidelines
3. Add proper documentation
4. Update relevant documentation files
5. Test on multiple devices/browsers

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- 📧 Email: support@sprintsync.com
- 📖 Documentation: [docs/](./docs/)
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

**Built with ❤️ by the SprintSync team**
