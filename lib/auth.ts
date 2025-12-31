import api from './api';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const authService = {
  // Token management
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  },

  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // API calls
  async register(data: RegisterData): Promise<AuthResponse> {
    // Transform data to match Laravel expectations
    const requestData = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation || data.password,
    };
    
    const response = await api.request('/api/register', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.request('/api/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  },

  async logout(): Promise<void> {
    this.removeToken();
    // Optional: call logout endpoint if your API has one
    await api.request('/api/logout', { method: 'POST' });
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  // Validate token with server (optional)
  async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      await api.request('/api/validate-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return true;
    } catch (error) {
      // Token is invalid, remove it
      this.removeToken();
      return false;
    }
  }
};

export default authService;