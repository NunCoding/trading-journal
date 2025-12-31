import api from './api';

export interface Trade {
  id: number;
  user_id: number;
  account_id: number;
  symbol: string;
  market_type: 'forex' | 'crypto' | 'stock';
  direction: 'buy' | 'sell';
  entry_price: number;
  exit_price?: number;
  stop_loss?: number;
  take_profit?: number;
  lot_size: number;
  risk_percent?: number;
  risk_amount?: number;
  open_time: string;
  close_time?: string;
  session?: 'asia' | 'london' | 'newyork';
  timeframe?: string;
  strategy_id?: number;
  notes?: string;
  tags?: number[];
  pnl?: number;
  pips?: number;
  status?: 'open' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface CreateTradeData {
  account_id: string;
  symbol: string;
  market_type: 'forex' | 'crypto' | 'stock';
  direction: 'buy' | 'sell';
  entry_price: number;
  exit_price?: number;
  stop_loss?: number;
  take_profit?: number;
  lot_size: number;
  risk_percent?: number;
  risk_amount?: number;
  open_time: string;
  close_time?: string;
  session?: 'asia' | 'london' | 'newyork';
  timeframe?: string;
  strategy_id?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateTradeData extends Partial<CreateTradeData> {
  id: number;
}

export interface TradeListResponse {
  data: Trade[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface Account {
  id: number | string;
  name: string;
}

export interface Strategy {
  id: number | string;
  name: string;
}

export interface TradeTag {
  id: number | string;
  name: string;
}

export const tradeService = {
  // Get all trades
  async getTrades(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    account_id?: string;
    strategy_id?: string;
  }): Promise<Trade[] | TradeListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.account_id) queryParams.append('account_id', params.account_id);
    if (params?.strategy_id) queryParams.append('strategy_id', params.strategy_id);

    const queryString = queryParams.toString();
    const endpoint = `/api/trades${queryString ? `?${queryString}` : ''}`;

    return api.request(endpoint, {
      method: 'GET',
    });
  },

  // Get single trade
  async getTrade(id: number): Promise<Trade> {
    return api.request(`/api/trades/${id}`, {
      method: 'GET',
    });
  },

  // Create new trade
  async createTrade(data: CreateTradeData): Promise<Trade> {
    return api.request('/api/trades', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update trade
  async updateTrade(id: number, data: Partial<CreateTradeData>): Promise<Trade> {
    return api.request(`/api/trades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete trade
  async deleteTrade(id: number): Promise<void> {
    return api.request(`/api/trades/${id}`, {
      method: 'DELETE',
    });
  },

  // Get accounts for dropdown
  async getAccounts(): Promise<Account[]> {
    const response = await api.request('/api/accounts', { method: 'GET' });
    return response.data || response;
  },

  // Get strategies for dropdown
  async getStrategies(): Promise<Strategy[]> {
    const response = await api.request('/api/strategies', { method: 'GET' });
    return response.data || response;
  },

  // Get trade tags for dropdown
  async getTradeTags(): Promise<TradeTag[]> {
    const response = await api.request('/api/trade-tags', { method: 'GET' });
    return response.data || response;
  },
};

export default tradeService;
