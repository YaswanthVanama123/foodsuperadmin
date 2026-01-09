import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor: Add Authorization Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('superadmin_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Only clear auth if it's an actual token expiry/invalid error
      // Don't clear on network errors or backend downtime
      const errorMessage = (error.response?.data as any)?.message || '';
      if (errorMessage.includes('token') || errorMessage.includes('expired') || errorMessage.includes('invalid')) {
        console.log('[Super Admin API] Token expired or invalid - clearing auth and redirecting to login');
        // Clear all auth data and redirect to login
        localStorage.removeItem('superadmin_token');
        localStorage.removeItem('superadmin_data');
        window.location.href = '/login';
      } else {
        console.warn('[Super Admin API] Received 401 but not clearing auth - might be temporary server issue');
      }
    } else if (!error.response) {
      // Network error - backend is down or unreachable
      console.warn('[Super Admin API] Network error - backend may be restarting or unreachable');
      // Don't clear auth data - keep user logged in
    }

    return Promise.reject(error);
  }
);

export { apiClient };
export default apiClient;
