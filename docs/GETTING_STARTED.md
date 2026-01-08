# Getting Started with Super Admin App

## Overview

The Super Admin App is a platform-wide management dashboard that allows platform administrators to manage multiple restaurants, subscriptions, plans, support tickets, and system-wide analytics. This application is built with React, TypeScript, and Vite.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB (v4.4 or higher)
- Backend server running

## Quick Start

### 1. Automated Setup (Recommended)

Run the setup script to automatically install dependencies and configure the app:

```bash
cd /Users/yaswanthgandhi/Documents/patlinks/packages/super-admin-app
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Manual Setup

If you prefer to set up manually:

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Build the project (verification)
npm run build
```

### 3. Environment Configuration

Edit `.env` file with your configuration:

```env
VITE_API_URL=http://localhost:5000
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5175`

### Production Build

```bash
npm run build
npm run preview
```

## Default Credentials

Use these credentials to log in to the super admin dashboard:

| Field    | Value          |
|----------|----------------|
| Username | superadmin     |
| Password | superadmin123  |

**Note:** These are default credentials created by the backend. Change them immediately in production!

## Creating Super Admin User

If the super admin user doesn't exist, create it:

```bash
cd ../backend
npm run create:superadmin
```

## Available Routes

The super admin app includes 11 comprehensive pages:

### 1. Login (`/`)
- Secure authentication for super admins
- JWT token-based authentication

### 2. Dashboard (`/dashboard`)
- Platform-wide statistics
- Total restaurants
- Total revenue across all restaurants
- Active subscriptions
- Platform growth trends
- Quick actions and shortcuts

### 3. Restaurants (`/restaurants`)
- View all restaurants on the platform
- Restaurant details and status
- Create new restaurant tenants
- Edit restaurant information
- Suspend/activate restaurants
- View restaurant-specific analytics
- Access restaurant admin panels

### 4. Admins (`/admins`)
- Manage restaurant admin accounts
- Create new admin users
- Edit admin details
- Assign admins to restaurants
- View admin activity logs
- Suspend/activate admin accounts
- Reset admin passwords

### 5. Subscriptions (`/subscriptions`)
- View all active subscriptions
- Subscription status tracking
- Billing history
- Payment status
- Subscription renewals
- Upgrade/downgrade plans
- Cancel subscriptions

### 6. Plans (`/plans`)
- Manage subscription plans
- Create new plans
- Edit existing plans
- Set pricing tiers
- Configure plan features
- Plan limits (tables, menu items, orders)
- Popular plan marking
- Enable/disable plans

### 7. Analytics (`/analytics`)
- Platform-wide revenue analytics
- Restaurant performance comparison
- Growth metrics
- Popular restaurants
- Revenue trends over time
- User engagement metrics
- Custom date range filtering

### 8. Reports (`/reports`)
- Generate comprehensive reports
- Revenue reports
- Restaurant performance reports
- Subscription reports
- Export to CSV/PDF
- Scheduled report generation
- Custom report filters

### 9. Support (`/support`)
- View all support tickets
- Ticket status management
- Assign tickets to team members
- Respond to tickets
- Ticket priority management
- Filter by status, priority, restaurant
- Ticket history and timeline

### 10. Audit Logs (`/audit-logs`)
- System-wide activity logs
- User actions tracking
- Security events
- Data changes audit trail
- Filter by user, action, date
- Export audit logs
- Compliance reporting

### 11. Settings (`/settings`)
- Platform settings
- System configuration
- Email templates
- Notification settings
- Security settings
- API configuration
- Backup and maintenance

## Key Features

### 1. Multi-Tenant Restaurant Management
- Create and manage multiple restaurant tenants
- Each restaurant has isolated data
- Subdomain-based tenant identification
- Restaurant onboarding workflow
- Bulk restaurant operations

### 2. Subscription & Billing Management
- Multiple subscription plans
- Flexible pricing tiers
- Automatic billing cycles
- Payment tracking
- Subscription analytics
- Revenue forecasting

### 3. Admin User Management
- Create restaurant admin accounts
- Role-based access control
- Activity monitoring
- Account lifecycle management
- Password reset capabilities

### 4. Platform Analytics
- Real-time dashboard metrics
- Revenue trends and forecasting
- Restaurant performance ranking
- User engagement analytics
- Custom reports and exports

### 5. Support System
- Ticket management
- Priority-based queue
- Assignment and routing
- Response templates
- SLA tracking

### 6. Audit & Compliance
- Comprehensive audit logs
- User activity tracking
- Security event monitoring
- Compliance reporting
- Data change history

## API Endpoints Used

### Authentication
- `POST /api/superadmin/auth/login` - Super admin login
- `POST /api/superadmin/auth/logout` - Super admin logout
- `GET /api/superadmin/auth/me` - Get current super admin

### Restaurants
- `GET /api/superadmin/restaurants` - Get all restaurants
- `POST /api/superadmin/restaurants` - Create restaurant
- `PUT /api/superadmin/restaurants/:id` - Update restaurant
- `DELETE /api/superadmin/restaurants/:id` - Delete restaurant
- `GET /api/superadmin/restaurants/:id/stats` - Restaurant statistics

### Admins
- `GET /api/superadmin/admins` - Get all admins
- `POST /api/superadmin/admins` - Create admin
- `PUT /api/superadmin/admins/:id` - Update admin
- `DELETE /api/superadmin/admins/:id` - Delete admin
- `POST /api/superadmin/admins/:id/suspend` - Suspend admin

### Subscriptions
- `GET /api/superadmin/subscriptions` - Get all subscriptions
- `POST /api/superadmin/subscriptions` - Create subscription
- `PUT /api/superadmin/subscriptions/:id` - Update subscription
- `DELETE /api/superadmin/subscriptions/:id` - Cancel subscription

### Plans
- `GET /api/superadmin/plans` - Get all plans
- `POST /api/superadmin/plans` - Create plan
- `PUT /api/superadmin/plans/:id` - Update plan
- `DELETE /api/superadmin/plans/:id` - Delete plan

### Analytics
- `GET /api/superadmin/analytics/platform` - Platform analytics
- `GET /api/superadmin/analytics/revenue` - Revenue analytics
- `GET /api/superadmin/analytics/restaurants` - Restaurant analytics

### Support
- `GET /api/superadmin/tickets` - Get all tickets
- `GET /api/superadmin/tickets/:id` - Get ticket details
- `PUT /api/superadmin/tickets/:id` - Update ticket
- `POST /api/superadmin/tickets/:id/respond` - Respond to ticket

### Audit Logs
- `GET /api/superadmin/audit-logs` - Get audit logs
- `GET /api/superadmin/audit-logs/export` - Export logs

## Project Structure

```
super-admin-app/
├── src/
│   ├── api/           # API client and endpoints
│   ├── components/    # Reusable components
│   ├── pages/         # Page components (11 pages)
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript types
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── public/            # Static assets
├── scripts/           # Setup and utility scripts
├── docs/              # Documentation
└── package.json       # Dependencies
```

## Admin Management Guide

### Creating a New Restaurant Admin

1. Navigate to `/admins` page
2. Click "Create Admin" button
3. Fill in admin details:
   - Username
   - Password
   - Email
   - First/Last name
   - Assigned restaurant
4. Set permissions and role
5. Click "Create"

### Managing Restaurant Admins

**View Admin Details:**
- Click on admin row to view full details
- See activity logs
- View assigned restaurant
- Check login history

**Edit Admin:**
- Click edit icon
- Update details
- Change assigned restaurant
- Modify permissions

**Suspend Admin:**
- Click suspend button
- Provide reason
- Admin cannot log in while suspended
- Can be reactivated later

**Reset Password:**
- Click reset password
- Generate temporary password
- Send to admin email
- Admin must change on first login

### Restaurant Management

**Creating New Restaurant:**
1. Go to `/restaurants`
2. Click "Add Restaurant"
3. Fill in:
   - Restaurant name
   - Subdomain (e.g., pizzahut)
   - Contact information
   - Address
   - Initial plan
4. System creates isolated database
5. Generate QR codes for tables

**Restaurant Status:**
- Active: Fully operational
- Suspended: Temporarily disabled
- Trial: In trial period
- Expired: Subscription expired

## Troubleshooting

### Backend Connection Issues

Check if the backend is running:

```bash
node scripts/check-backend.js
```

### Port Already in Use

If port 5175 is already in use, specify a different port:

```bash
npm run dev -- --port 5176
```

### Build Errors

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Authentication Issues

1. Verify super admin exists in database
2. Run create super admin script if needed:
   ```bash
   cd ../backend
   npm run create:superadmin
   ```
3. Clear browser local storage
4. Check backend JWT configuration

### Database Connection

If you see database errors:

```bash
# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
net start MongoDB                       # Windows

# Check MongoDB status
mongo --eval "db.adminCommand('ping')"
```

### API Endpoint Errors

1. Verify backend is running on port 5000
2. Check VITE_API_URL in .env
3. Review backend logs for errors
4. Verify super admin routes are registered
5. Check CORS configuration in backend

## Development Tips

### Hot Module Replacement (HMR)

Vite provides fast HMR out of the box. Changes to React components will update instantly.

### TypeScript

The project uses TypeScript for type safety. Run type checking:

```bash
npm run build  # Runs tsc before build
```

### Linting

Check code quality:

```bash
npm run lint
```

### Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the app.

## Testing the App

1. **Login Test**: Use super admin credentials
2. **View Dashboard**: Check platform statistics
3. **Create Restaurant**: Add a new restaurant tenant
4. **Create Admin**: Add an admin for the restaurant
5. **View Analytics**: Check platform-wide analytics
6. **Manage Plans**: View and edit subscription plans
7. **Check Audit Logs**: View system activity

## Production Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Environment Variables for Production

Create a `.env.production` file:

```env
VITE_API_URL=https://your-api-domain.com
```

### Security Considerations

1. Change default super admin password
2. Enable HTTPS in production
3. Configure proper CORS origins
4. Set up rate limiting
5. Enable audit logging
6. Regular security updates
7. Database backups
8. Monitor suspicious activity

### Deploy to Server

You can deploy the `dist/` folder to any static hosting service:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Nginx
- Apache

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review backend logs
3. Check browser console for errors
4. Verify all services are running (MongoDB, Backend, Frontend)
5. Check super admin permissions

## Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Multi-tenant Architecture Guide](../../../IMPLEMENTATION_GUIDE.md)
