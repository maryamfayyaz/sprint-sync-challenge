# SprintSync Frontend

A modern, AI-powered task management application built with Next.js, TypeScript, and Tailwind CSS. SprintSync helps fast-moving teams organize, track, and complete tasks efficiently with intelligent suggestions and comprehensive analytics.

## ✨ Features

### 🎯 **Core Task Management**
- **Kanban Board**: Drag-and-drop task management with TODO, IN_PROGRESS, and DONE columns
- **Task CRUD Operations**: Create, read, update, and delete tasks with validation
- **Status Transitions**: Seamless task status updates with timestamp tracking
- **Time Tracking**: Log and track time spent on tasks with analytics
- **Task Assignment**: Assign tasks to specific users (admin feature)

### 🤖 **AI-Powered Features**
- **AI Task Suggestions**: Get multiple intelligent task suggestions based on prompts
- **Smart Task Creation**: Create tasks directly from AI suggestions with one click
- **Contextual Recommendations**: AI analyzes your input to provide relevant task ideas

### 📊 **Analytics & Insights**
- **Completion Timeline**: Track when tasks were started and completed
- **Time Analytics**: Visualize time logged per day with interactive charts
- **Status Distribution**: Pie charts showing task breakdown by status
- **Performance Metrics**: Completion rates, total hours, and productivity insights
- **Recent Activity**: Timeline of recent task updates and completions

### 👥 **User Management**
- **Role-Based Access**: Admin and regular user roles with different permissions
- **User Administration**: Create and manage users (admin only)
- **Task Assignment**: Assign tasks to specific team members
- **Performance Tracking**: View top performers and completion statistics

### 🔐 **Authentication & Security**
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Permissions**: Different access levels for admins and users
- **Protected Routes**: Secure access to sensitive features
- **Session Management**: Automatic token validation and refresh

### 📱 **User Experience**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Optimistic updates with error handling
- **Toast Notifications**: User-friendly success and error messages
- **Loading States**: Clear feedback during async operations
- **Accessibility**: WCAG compliant with proper ARIA labels

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Validation**: Zod schemas
- **Date Handling**: date-fns
- **HTTP Client**: Custom API client with error handling

## 🚀 Quick Start

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
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Configure your environment variables:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_APP_ENV=development
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Default Login

If your backend has demo data:
- **Email**: demo@example.com
- **Password**: password

## 📁 Project Structure

\`\`\`
sprintsync-frontend/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Dashboard page
│   ├── login/            # Authentication pages
│   └── loading.tsx       # Loading component
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── ai-suggest-modal.tsx    # AI suggestions modal
│   ├── analytics-chart.tsx     # Analytics dashboard
│   ├── kanban-board.tsx        # Kanban board
│   ├── task-card.tsx          # Individual task cards
│   ├── create-task-modal.tsx   # Task creation modal
│   ├── edit-task-modal.tsx     # Task editing modal
│   ├── admin-panel.tsx         # Admin management
│   └── profile-view.tsx        # User profile
├── hooks/                 # Custom React hooks
│   ├── use-auth.tsx      # Authentication hook
│   └── use-toast.tsx     # Toast notifications
├── lib/                   # Utility libraries
│   ├── api-client.ts     # HTTP client
│   ├── logger.ts         # Logging utility
│   ├── utils.ts          # General utilities
│   └── validation.ts     # Zod schemas
├── types/                 # TypeScript definitions
│   └── task.ts           # Task type definitions
└── docs/                  # Documentation
    ├── API.md            # API integration guide
    ├── COMPONENTS.md     # Component documentation
    └── DEPLOYMENT.md     # Deployment guide
\`\`\`

## 🎭 User Roles & Permissions

### 👤 **Regular User**
- ✅ View and manage assigned tasks
- ✅ Update task status and time logs
- ✅ Use AI suggestions for task creation
- ✅ View personal analytics
- ❌ Cannot delete tasks
- ❌ Cannot manage other users
- ❌ Cannot assign tasks to others

### 👑 **Administrator**
- ✅ All regular user permissions
- ✅ View and manage all tasks in the system
- ✅ Create and manage users
- ✅ Assign tasks to any user
- ✅ Delete tasks
- ✅ Access admin panel with system statistics
- ✅ View comprehensive analytics for all users

## 🔄 Task Lifecycle

### Status Flow
\`\`\`
TODO → IN_PROGRESS → DONE
  ↑         ↑         ↓
  └─────────┴─────────┘
\`\`\`

### Timestamp Tracking
- **Created**: When task is first created
- **In Progress**: When moved to IN_PROGRESS status (`inProgressAt`)
- **Completed**: When moved to DONE status (`completedAt`)
- **Updated**: Last modification timestamp

### Time Logging
- Manual time entry in minutes
- Cumulative tracking across status changes
- Analytics and reporting integration

## 🤖 AI Integration

### AI Suggest Modal
The AI Suggest feature provides intelligent task suggestions based on user prompts:

1. **Input Prompt**: User describes what they need help with
2. **API Call**: Sends request to `/ai/suggest` endpoint
3. **Multiple Suggestions**: Receives 3 AI-generated task suggestions
4. **One-Click Creation**: Create tasks directly from suggestions
5. **Smart Formatting**: Automatically cleans titles and formats descriptions

### API Integration
\`\`\`typescript
// Request format
POST /ai/suggest
{
  "prompt": "improve user interface"
}

// Response format
{
  "suggestions": [
    {
      "title": "Revamp Task Page User Interface",
      "description": "Enhance the design and functionality..."
    }
  ]
}
\`\`\`

## 📊 Analytics Features

### Dashboard Metrics
- **Total Tasks**: Count of all tasks
- **Completed Tasks**: Number of finished tasks
- **Completion Rate**: Percentage of completed tasks
- **Time Logged**: Total hours worked

### Charts & Visualizations
- **Time Logged Chart**: 7-day activity timeline
- **Status Distribution**: Pie chart of task statuses
- **Completion Timeline**: Recent completions with timestamps
- **Performance Trends**: User productivity metrics

### Admin Analytics
- **User Statistics**: Active users, completion rates
- **System Metrics**: Total hours, daily completion rates
- **Top Performers**: Leaderboard with completion statistics
- **Completion Trends**: Weekly patterns and insights

## 🔧 Development

### Available Scripts

\`\`\`bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
\`\`\`

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js rules
- **Prettier**: Code formatting (recommended)
- **Zod**: Runtime validation for forms and API responses

### Environment Variables

\`\`\`env
# Required
NEXT_PUBLIC_API_URL=http://localhost:3001

# Optional
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_GA_ID=your-google-analytics-id
\`\`\`

## 🧪 Testing

### Manual Testing Checklist

- [ ] User authentication (login/logout)
- [ ] Task CRUD operations
- [ ] Drag and drop functionality
- [ ] AI suggestion generation
- [ ] Task creation from AI suggestions
- [ ] Status transitions with timestamps
- [ ] Time logging and analytics
- [ ] Role-based access control
- [ ] Responsive design on mobile
- [ ] Error handling and loading states

### API Testing

Ensure your backend API is running and accessible:

\`\`\`bash
# Test API connectivity
curl http://localhost:3001/health

# Test authentication
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password"}'
\`\`\`

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including:

- Vercel deployment (recommended)
- Netlify deployment
- Docker containerization
- AWS deployment
- Environment configuration
- CI/CD setup

## 📚 Documentation

- **[API Integration](./API.md)**: Complete API documentation
- **[Components](./COMPONENTS.md)**: Component usage guide
- **[Deployment](./DEPLOYMENT.md)**: Deployment instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for async operations
- Ensure responsive design
- Write meaningful commit messages

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify backend is running on `http://localhost:3001`
   - Check CORS configuration in backend
   - Validate environment variables

2. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify backend auth endpoints

3. **Build Errors**
   - Run `npm install` to update dependencies
   - Check TypeScript errors with `npm run type-check`
   - Clear Next.js cache: `rm -rf .next`

4. **AI Suggestions Not Working**
   - Verify `/ai/suggest` endpoint is available
   - Check API response format matches expected structure
   - Ensure proper error handling in modal

### Getting Help

- Check the [Issues](../../issues) page for known problems
- Review the [API Documentation](./API.md) for integration details
- Consult the [Component Guide](./COMPONENTS.md) for usage examples

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Recharts](https://recharts.org/) for beautiful data visualization
- [Lucide](https://lucide.dev/) for the icon library

---

**SprintSync** - Empowering teams with AI-driven task management 🚀

