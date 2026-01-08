// ============================================
// CORE TYPES
// ============================================
// Note: Restaurant, Admin, Subscription, and Plan types are defined in their
// respective API files (api/restaurants.api.ts, api/admins.api.ts, etc.)
// Import from those files instead of using these definitions

// Super Admin Types
export interface SuperAdmin {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  lastLoginAt?: Date | string;
  createdAt: string;
  updatedAt?: string;
}

// Platform Statistics Types (used by Dashboard and Analytics)
export interface PlatformStats {
  restaurants: {
    total: number;
    active: number;
    inactive: number;
  };
  subscriptions: {
    byStatus: Record<string, number>;
    byPlan: Record<string, number>;
  };
  revenue: {
    totalMonthlyRecurring: number;
    totalOrderRevenue: number;
    averageOrderValue: number;
    totalRevenue: number;
  };
  users: {
    totalCustomers: number;
    activeCustomers: number;
    inactiveCustomers: number;
  };
  orders: {
    total: number;
  };
}

// Audit Log Types
export interface AuditLog {
  _id: string;
  actor: {
    id: string;
    type: 'super_admin' | 'admin' | 'system';
    name?: string;
  };
  action: string;
  resource: {
    type: string;
    id: string;
    name?: string;
  };
  details?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  createdAt: string;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  filters?: Record<string, any>;
}

// Support Ticket Types
export interface SupportTicket {
  _id: string;
  restaurantId: string;
  restaurantName?: string;
  subject: string;
  description?: string;
  category?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  messages?: TicketMessage[];
  createdAt: string;
  updatedAt?: string;
  assignedTo?: string;
  assignedToName?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'super_admin' | 'restaurant_admin';
  message: string;
  attachments?: string[];
  createdAt: string;
}

export interface TicketsResponse {
  tickets: SupportTicket[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTickets: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  statistics?: {
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
}

// Pagination Type
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Form Types
export interface LoginFormData {
  username: string;
  password: string;
}

// Recent Activity Types
export type ActivityAction =
  | 'restaurant_created'
  | 'restaurant_updated'
  | 'restaurant_activated'
  | 'restaurant_suspended'
  | 'restaurant_deleted'
  | 'subscription_created'
  | 'subscription_updated'
  | 'subscription_upgraded'
  | 'subscription_cancelled'
  | 'subscription_renewed'
  | 'admin_created'
  | 'admin_updated'
  | 'admin_deleted'
  | 'plan_created'
  | 'plan_updated'
  | 'plan_deleted'
  | 'payment_received'
  | 'payment_failed';

export interface RecentActivity {
  id: string;
  action: ActivityAction;
  restaurantId?: string;
  restaurantName?: string;
  description: string;
  metadata?: Record<string, any>;
  performedBy?: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: ActivityAction;
  description: string;
  timestamp: string;
  actor?: string;
  restaurant?: string;
}

// Chart Data Types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  subscriptionCount?: number;
}

export interface GrowthChartData {
  month: string;
  newRestaurants: number;
  activeRestaurants: number;
  churnedRestaurants?: number;
}

