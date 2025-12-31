import { authService } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3006';

export const api = {
  baseURL: API_BASE_URL,
  
  // Auth endpoints - try different common patterns
  register: `${API_BASE_URL}/api/register`,  // Laravel API pattern
  login: `${API_BASE_URL}/api/login`,
  
  // Helper function for making API calls
  async request(endpoint: string, options: RequestInit = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    // Get auth token
    const token = authService.getToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',  // Important for Laravel APIs
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
      redirect: 'error', // Prevent automatic redirects - throw error instead
      ...options,
    };

    try {
      const response = await fetch(url, config);
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        authService.removeToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Session expired. Please login again.');
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        // Try to parse as JSON for Laravel validation errors
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        (error as any).errors = errorData.errors || {};
        (error as any).status = response.status;
        throw error;
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // Check if it's a redirect error (Laravel redirecting to login)
      if (error instanceof TypeError && error.message.includes('redirect')) {
        authService.removeToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Session expired. Please login again.');
      }
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Cannot connect to API server at ${url}. Please check if the server is running and accessible.`);
      }
      
      throw error;
    }
  }
};

export default api;