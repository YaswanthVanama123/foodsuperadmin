import apiClient from './client';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  restaurantId: string;
  restaurantName?: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assignedTo?: string;
  assignedToName?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface TicketsResponse {
  tickets: SupportTicket[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface TicketMessage {
  sender: 'restaurant' | 'super_admin' | 'system';
  senderName: string;
  message: string;
  timestamp: string;
  attachments?: string[];
  isInternal?: boolean;
}

export interface CreateTicketRequest {
  restaurantId: string;
  title: string;
  description: string;
  category: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface UpdateTicketRequest {
  status?: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  category?: string;
  title?: string;
  description?: string;
}

export interface AddMessageRequest {
  message: string;
  sender: 'super_admin';
  senderName: string;
  attachments?: string[];
  isInternal?: boolean;
}

export interface TicketStatistics {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
  avgResolutionTime: number;
}

const supportApi = {
  getTickets: async (
    page?: number,
    limit?: number,
    status?: string,
    priority?: string,
    restaurantId?: string
  ): Promise<TicketsResponse> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    if (restaurantId) params.append('restaurantId', restaurantId);

    const response = await apiClient.get<TicketsResponse>(
      `/api/superadmin/tickets?${params.toString()}`
    );
    return response.data;
  },

  getTicketById: async (id: string): Promise<SupportTicket> => {
    const response = await apiClient.get<SupportTicket>(`/api/superadmin/tickets/${id}`);
    return response.data;
  },

  createTicket: async (data: CreateTicketRequest): Promise<SupportTicket> => {
    const response = await apiClient.post<SupportTicket>('/api/superadmin/tickets', data);
    return response.data;
  },

  updateTicket: async (id: string, data: UpdateTicketRequest): Promise<SupportTicket> => {
    const response = await apiClient.put<SupportTicket>(`/api/superadmin/tickets/${id}`, data);
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: 'open' | 'in-progress' | 'resolved' | 'closed'
  ): Promise<SupportTicket> => {
    const response = await apiClient.patch<SupportTicket>(`/api/superadmin/tickets/${id}/status`, {
      status,
    });
    return response.data;
  },

  assignTicket: async (id: string, assignedTo: string): Promise<SupportTicket> => {
    const response = await apiClient.patch<SupportTicket>(`/api/superadmin/tickets/${id}/assign`, {
      assignedTo,
    });
    return response.data;
  },

  addMessage: async (id: string, data: AddMessageRequest): Promise<SupportTicket> => {
    const response = await apiClient.post<SupportTicket>(
      `/api/superadmin/tickets/${id}/messages`,
      data
    );
    return response.data;
  },

  resolveTicket: async (id: string, resolutionNotes?: string): Promise<SupportTicket> => {
    const response = await apiClient.post<SupportTicket>(`/api/superadmin/tickets/${id}/resolve`, {
      resolutionNotes,
    });
    return response.data;
  },

  deleteTicket: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/superadmin/tickets/${id}`);
  },

  getStatistics: async (): Promise<TicketStatistics> => {
    const response = await apiClient.get<TicketStatistics>('/api/superadmin/tickets/stats');
    return response.data;
  },
};

export default supportApi;
