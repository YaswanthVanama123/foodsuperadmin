// Super Admin Types
export interface SuperAdmin {
  id: string;
  username: string;
  email: string;
  role: 'super_admin';
  createdAt: string;
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  ownerId: string;
  subscription: Subscription;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  updatedAt?: string;
}

// Restaurant Admin Types
export interface RestaurantAdmin {
  id: string;
  username: string;
  email: string;
  restaurantId: string;
  role: 'admin' | 'manager';
  createdAt: string;
}

// Subscription Types
export interface Subscription {
  id: string;
  restaurantId: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  price: number;
  currency?: string;
}

// Plan Types
export interface Plan {
  id: string;
  name: string;
  price: number;
  currency?: string;
  features: string[];
  maxOrders: number;
  maxMenuItems: number;
  interval?: 'monthly' | 'yearly';
}

// Platform Statistics Types
export interface PlatformStats {
  totalRestaurants: number;
  activeRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  activeUsers: number;
  suspendedRestaurants?: number;
  pendingRestaurants?: number;
  activeSubscriptions: number;
  totalSubscriptions: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  userGrowth: number;
  todayOrders: number;
  subscriptionsByPlan: {
    starter: number;
    professional: number;
    enterprise: number;
  };
  revenueByPlan: {
    starter: number;
    professional: number;
    enterprise: number;
  };
}

// Audit Log Types
export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  resource: string;
  details: string | Record<string, any>;
  timestamp: string;
  adminName?: string;
}

// Support Ticket Types
export interface SupportTicket {
  id: string;
  restaurantId: string;
  restaurantName?: string;
  subject: string;
  description?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt?: string;
  assignedTo?: string;
}

// Payment Record Types
export interface PaymentRecord {
  id: string;
  restaurantId: string;
  restaurantName?: string;
  amount: number;
  currency?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date: string;
  paymentMethod?: string;
  transactionId?: string;
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
  errors?: Record<string, string[]>;
}

// Form Types
export interface LoginFormData {
  username: string;
  password: string;
}

// Recent Activity Types
export type ActivityAction =
  | 'restaurant_created'
  | 'restaurant_activated'
  | 'restaurant_suspended'
  | 'subscription_created'
  | 'subscription_upgraded'
  | 'subscription_cancelled'
  | 'subscription_renewed'
  | 'admin_created'
  | 'admin_deleted'
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
