# Patlinks Super Admin Portal

The **Patlinks Super Admin Portal** is a comprehensive platform management application for the multi-tenant restaurant ordering system. This application provides super administrators with complete control over restaurants, admins, subscriptions, plans, analytics, and platform-wide settings.

## Features

The Super Admin Portal includes the following key features:

### 1. Dashboard
- Platform-wide statistics and metrics
- Real-time monitoring of restaurants, admins, and subscriptions
- Revenue tracking and growth analytics
- Visual charts for revenue trends and restaurant growth
- Quick action shortcuts to key areas

### 2. Restaurant Management
- View, create, edit, and delete restaurants
- Comprehensive restaurant details and profiles
- Filter restaurants by status (active, inactive, suspended)
- Search functionality across restaurant names and emails
- Restaurant-specific subscription management

### 3. Admin Management
- Manage restaurant admin accounts
- Create and assign admins to restaurants
- Password reset functionality
- Admin activity tracking
- Role and permission management

### 4. Subscription Management
- View all active and inactive subscriptions
- Create new subscriptions for restaurants
- Edit subscription details and billing cycles
- Cancel or extend subscriptions
- Track subscription status (active, cancelled, expired, pending)
- Export subscription data

### 5. Plan Management
- View and manage subscription plans
- Create custom pricing tiers (Starter, Professional, Enterprise)
- Configure plan features and limits
- Set pricing and billing cycles
- Feature toggles for plan customization

### 6. Analytics
- Comprehensive platform analytics and insights
- Revenue trends and forecasting
- Restaurant growth metrics
- User engagement statistics
- Performance indicators

### 7. Settings
- General platform settings
- Email configuration (SMTP settings)
- Payment gateway integration (Stripe, PayPal)
- Feature toggles for platform-wide features
- Security settings and authentication controls

### 8. Audit Logs
- Complete audit trail of all platform actions
- Filter logs by action type, entity, and date range
- User activity tracking
- Export audit logs for compliance
- Detailed event information

### 9. Support Tickets
- View and manage customer support tickets
- Filter tickets by status and priority
- Respond to tickets and track resolution
- Ticket assignment and escalation
- Support metrics and analytics

### 10. Reports
- Generate custom reports for various metrics
- Revenue reports
- Restaurant performance reports
- Subscription analytics
- User activity reports
- Export reports in multiple formats

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Toast notifications
- **Recharts** - Charting library for data visualization
- **Axios** - HTTP client for API requests
- **Headless UI** - Unstyled accessible UI components

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **Autoprefixer** - CSS vendor prefixing
- **PostCSS** - CSS processing

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## Installation

Follow these steps to set up the Super Admin Portal:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd patlinks/packages/super-admin-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5175`

## Development Commands

- **Start development server**
  ```bash
  npm run dev
  ```
  Runs the app in development mode on port 5175

- **Build for production**
  ```bash
  npm run build
  ```
  Creates an optimized production build in the `dist` folder

- **Preview production build**
  ```bash
  npm run preview
  ```
  Serves the production build locally for testing

- **Lint code**
  ```bash
  npm run lint
  ```
  Checks code quality and identifies issues

## Default Credentials

For development and testing purposes, use the following credentials:

- **Username:** `superadmin`
- **Password:** `superadmin123`

> **Important:** Change these credentials immediately in production environments.

## Project Structure

```
super-admin-app/
├── src/
│   ├── api/                    # API integration layer
│   │   ├── auth.api.ts
│   │   ├── dashboard.api.ts
│   │   ├── restaurants.api.ts
│   │   ├── admins.api.ts
│   │   ├── subscriptions.api.ts
│   │   ├── plans.api.ts
│   │   ├── analytics.api.ts
│   │   ├── settings.api.ts
│   │   ├── audit.api.ts
│   │   ├── support.api.ts
│   │   └── reports.api.ts
│   ├── components/             # React components
│   │   ├── common/             # Shared components
│   │   ├── layout/             # Layout components (Sidebar, Header)
│   │   ├── ui/                 # UI primitives (Button, Input, Card, etc.)
│   │   ├── restaurants/        # Restaurant-specific components
│   │   ├── admins/             # Admin management components
│   │   ├── subscriptions/      # Subscription components
│   │   ├── plans/              # Plan management components
│   │   ├── settings/           # Settings components
│   │   ├── audit/              # Audit log components
│   │   ├── support/            # Support ticket components
│   │   ├── reports/            # Report generation components
│   │   └── ProtectedRoute.tsx  # Route protection wrapper
│   ├── context/                # React Context providers
│   │   └── SuperAdminAuthContext.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   ├── useRestaurants.ts
│   │   └── useSubscriptions.ts
│   ├── pages/                  # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Restaurants.tsx
│   │   ├── Admins.tsx
│   │   ├── Subscriptions.tsx
│   │   ├── Plans.tsx
│   │   ├── Analytics.tsx
│   │   ├── Settings.tsx
│   │   ├── AuditLogs.tsx
│   │   ├── Support.tsx
│   │   ├── Reports.tsx
│   │   └── index.ts
│   ├── types/                  # TypeScript type definitions
│   │   ├── restaurant.types.ts
│   │   ├── admin.types.ts
│   │   └── subscription.types.ts
│   ├── utils/                  # Utility functions
│   │   └── apiClient.ts
│   ├── App.tsx                 # Main App component with routing
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── .env                        # Environment variables
├── index.html                  # HTML template
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── README.md                   # This file
```

## API Integration

The Super Admin Portal integrates with a backend API for all data operations. The API base URL is configured via the `VITE_API_BASE_URL` environment variable.

### Authentication
- Uses JWT token-based authentication
- Tokens are stored in localStorage
- Automatic token refresh on page load
- Protected routes redirect to login when unauthenticated

### API Modules
- **Auth API** - Login, logout, token management
- **Dashboard API** - Platform statistics and metrics
- **Restaurants API** - CRUD operations for restaurants
- **Admins API** - Admin user management
- **Subscriptions API** - Subscription management
- **Plans API** - Plan configuration
- **Analytics API** - Analytics and reporting data
- **Settings API** - Platform settings management
- **Audit API** - Audit log retrieval
- **Support API** - Support ticket management
- **Reports API** - Report generation

### Error Handling
- Centralized error handling via Axios interceptors
- User-friendly error messages via toast notifications
- Automatic retry logic for failed requests
- Network error detection and recovery

## Routing Structure

The application uses React Router v6 with the following routes:

- `/login` - Public login page
- `/` - Redirects to `/dashboard`
- `/dashboard` - Platform dashboard (protected)
- `/restaurants` - Restaurant management (protected)
- `/admins` - Admin management (protected)
- `/subscriptions` - Subscription management (protected)
- `/plans` - Plan management (protected)
- `/analytics` - Analytics dashboard (protected)
- `/settings` - Platform settings (protected)
- `/audit-logs` - Audit log viewer (protected)
- `/support` - Support ticket management (protected)
- `/reports` - Report generation (protected)

All protected routes require authentication and will redirect to `/login` if the user is not authenticated.

## Styling and Theming

The application uses a **violet/purple color theme** throughout:

- Primary color: Violet (#8b5cf6)
- Gradient backgrounds for login and loading states
- Tailwind CSS for utility-first styling
- Responsive design for all screen sizes
- Custom toast notifications with violet theming

## Security Features

- JWT token authentication
- Secure token storage in localStorage
- Automatic token cleanup on logout
- Protected route guards
- Session timeout handling
- CSRF protection (when backend supports it)
- XSS prevention through React's built-in sanitization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

To contribute to the Super Admin Portal:

1. Create a feature branch from `main`
2. Make your changes with clear commit messages
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## License

Copyright 2024 Patlinks. All rights reserved.

---

**Built with React + TypeScript + Vite**

For questions or support, please contact the development team.
