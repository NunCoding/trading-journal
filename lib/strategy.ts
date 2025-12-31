import api from './api';

export interface Strategy {
  id: number;
  user_id: number;
  name: string;
  description: string;
  is_active: boolean;
  status: 'testing' | 'active' | 'paused';
  timeframes: string[];
  symbols: string[];
  risk_per_trade: string;
  min_rr_ratio: string;
  max_rr_ratio: string;
  entry_rules: string;
  exit_rules: string;
  trades_count: number;
  win_rate?: number;
  profit_loss?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateStrategyData {
  name: string;
  description: string;
  status: 'testing' | 'active' | 'paused';
  timeframes: string[];
  symbols: string[];
  risk_per_trade: number;
  min_rr_ratio?: number;
  max_rr_ratio?: number;
  entry_rules?: string;
  exit_rules?: string;
}

export interface UpdateStrategyData extends Partial<CreateStrategyData> {
  id: number;
}

export interface StrategyListResponse {
  data: Strategy[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const strategyService = {
  // Get all strategies
  async getStrategies(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
  }): Promise<Strategy[] | StrategyListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = `/api/strategies${queryString ? `?${queryString}` : ''}`;

    return api.request(endpoint, {
      method: 'GET',
    });
  },

  // Get single strategy
  async getStrategy(id: number): Promise<Strategy> {
    return api.request(`/api/strategies/${id}`, {
      method: 'GET',
    });
  },

  // Create new strategy
  async createStrategy(data: CreateStrategyData): Promise<Strategy> {
    return api.request('/api/strategies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update strategy
  async updateStrategy(id: number, data: Partial<CreateStrategyData>): Promise<Strategy> {
    return api.request(`/api/strategies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete strategy
  async deleteStrategy(id: number): Promise<void> {
    return api.request(`/api/strategies/${id}`, {
      method: 'DELETE',
    });
  },

  // Get strategy statistics
  async getStrategyStats(id: number): Promise<{
    total_trades: number;
    win_rate: number;
    profit_loss: number;
    avg_profit: number;
    avg_loss: number;
    max_drawdown: number;
  }> {
    return api.request(`/api/strategies/${id}/stats`, {
      method: 'GET',
    });
  },
};

export default strategyService;