import apiClient from './client';

export interface AuditLog {
  _id: string;
  action: string;
  resource: string;
  resourceId?: string;
  userId: string;
  username: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  timestamp: string;
  status: 'success' | 'failure';
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse<T> {
  data: T;
}

export interface AuditLogFilters {
  action?: string;
  resource?: string;
  userId?: string;
  status?: 'success' | 'failure';
  startDate?: string;
  endDate?: string;
}

export interface AuditStatistics {
  totalLogs: number;
  actionCounts: Record<string, number>;
  resourceTypeCounts: Record<string, number>;
  actorTypeCounts: Record<string, number>;
  severityCounts: Record<string, number>;
  recentActivity: number;
  avgLogsPerDay: number;
}

const auditApi = {
  getLogs: async (
    page?: number,
    limit?: number,
    filters?: AuditLogFilters
  ): Promise<AuditLogsResponse> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    if (filters) {
      if (filters.action) params.append('action', filters.action);
      if (filters.resource) params.append('resource', filters.resource);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
    }

    const response = await apiClient.get<ApiResponse<AuditLogsResponse>>(
      `/api/superadmin/audit-logs?${params.toString()}`
    );
    return response.data.data;
  },

  getLogById: async (id: string): Promise<AuditLog> => {
    const response = await apiClient.get<ApiResponse<AuditLog>>(`/api/superadmin/audit-logs/${id}`);
    return response.data.data;
  },

  getStatistics: async (filters?: AuditLogFilters): Promise<AuditStatistics> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.action) params.append('action', filters.action);
      if (filters.resource) params.append('resource', filters.resource);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
    }

    const response = await apiClient.get<ApiResponse<AuditStatistics>>(
      `/api/superadmin/audit-logs/stats?${params.toString()}`
    );
    return response.data.data;
  },

  exportLogs: async (format: 'csv' | 'json', filters?: AuditLogFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    params.append('format', format);
    if (filters) {
      if (filters.action) params.append('action', filters.action);
      if (filters.resource) params.append('resource', filters.resource);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
    }

    const response = await apiClient.get(
      `/api/superadmin/audit-logs/export?${params.toString()}`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  getLogsByActor: async (actorId: string, page?: number, limit?: number): Promise<AuditLogsResponse> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await apiClient.get<ApiResponse<AuditLogsResponse>>(
      `/api/superadmin/audit-logs/actor/${actorId}?${params.toString()}`
    );
    return response.data.data;
  },

  getLogsByResource: async (
    resourceId: string,
    resourceType?: string,
    page?: number,
    limit?: number
  ): Promise<AuditLogsResponse> => {
    const params = new URLSearchParams();
    if (resourceType) params.append('resourceType', resourceType);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await apiClient.get<ApiResponse<AuditLogsResponse>>(
      `/api/superadmin/audit-logs/resource/${resourceId}?${params.toString()}`
    );
    return response.data.data;
  },

  cleanupOldLogs: async (daysToKeep: number = 365): Promise<{ deletedCount: number }> => {
    const params = new URLSearchParams();
    params.append('daysToKeep', daysToKeep.toString());

    const response = await apiClient.delete<ApiResponse<{ deletedCount: number }>>(
      `/api/superadmin/audit-logs/cleanup?${params.toString()}`
    );
    return response.data.data;
  },
};

export default auditApi;
