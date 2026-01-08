// Export API client
export { default as apiClient } from './client';

// Export API modules
export { default as authApi } from './auth.api';
export { default as dashboardApi } from './dashboard.api';
export { default as restaurantsApi } from './restaurants.api';
export { default as adminsApi } from './admins.api';
export { default as subscriptionsApi } from './subscriptions.api';
export { default as plansApi } from './plans.api';
export { default as analyticsApi } from './analytics.api';
export { default as auditApi } from './audit.api';
export { default as supportApi } from './support.api';

// Export types from auth.api
export type {
  LoginRequest,
  LoginResponse,
  SuperAdmin,
} from './auth.api';

// Export types from dashboard.api
export type {
  DashboardStats,
  ActivityItem,
  RecentActivity,
} from './dashboard.api';

// Export types from restaurants.api
export type {
  Restaurant,
  RestaurantsResponse,
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
  UpdateStatusRequest,
} from './restaurants.api';

// Export types from admins.api
export type {
  Admin,
  AdminsResponse,
  CreateAdminRequest,
  UpdateAdminRequest,
} from './admins.api';

// Export types from subscriptions.api
export type {
  Subscription,
  SubscriptionsResponse,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
} from './subscriptions.api';

// Export types from plans.api
export type {
  Plan,
  PlanFeature,
  PlansResponse,
  CreatePlanRequest,
  UpdatePlanRequest,
} from './plans.api';

// Export types from analytics.api
export type {
  RevenueDataPoint,
  PlatformRevenueResponse,
  GrowthDataPoint,
  RestaurantGrowthResponse,
  TopRestaurant,
  TopRestaurantsResponse,
} from './analytics.api';

// Export types from audit.api
export type {
  AuditLog,
  AuditLogsResponse,
  AuditLogFilters,
} from './audit.api';

// Export types from support.api
export type {
  SupportTicket,
  TicketsResponse,
  UpdateTicketRequest,
} from './support.api';
