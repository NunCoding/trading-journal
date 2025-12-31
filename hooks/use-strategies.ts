import { useState, useEffect } from 'react';
import { strategyService, Strategy, CreateStrategyData, StrategyListResponse } from '@/lib/strategy';
import { useToast } from '@/hooks/use-toast';

export function useStrategies(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}) {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);
  const { toast } = useToast();

  const fetchStrategies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await strategyService.getStrategies(params);
      // Handle different response formats
      let strategiesData: Strategy[] = [];
      
      if (Array.isArray(response)) {
        // Response is directly an array
        strategiesData = response;
      } else if (response && Array.isArray(response.data)) {
        // Response is { data: [...] }
        strategiesData = response.data;
        setMeta(response.meta);
      } else if (response && typeof response === 'object') {
        // Response might be a single object or other format
        strategiesData = [];
      }
      setStrategies(strategiesData);
    } catch (err: any) {
      console.error('Fetch strategies error:', err);
      setError(err.message || 'Failed to fetch strategies');
      setStrategies([]); // Set empty array on error
      toast({
        title: "Error",
        description: "Failed to load strategies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, [params?.page, params?.per_page, params?.search, params?.status]);

  const createStrategy = async (data: CreateStrategyData): Promise<Strategy | null> => {
    try {
      const newStrategy = await strategyService.createStrategy(data);
      
      // Ensure we have a valid strategies array before updating
      setStrategies(prev => Array.isArray(prev) ? [newStrategy, ...prev] : [newStrategy]);
      
      toast({
        title: "🎉 Strategy Created!",
        description: `"${newStrategy.name || 'New strategy'}" has been successfully created and is ready to use.`,
        duration: 5000,
      });
      return newStrategy;
    } catch (err: any) {
      let errorMessage = "Failed to create strategy";
      
      if (err.errors && Object.keys(err.errors).length > 0) {
        const errorMessages = Object.values(err.errors).flat() as string[];
        errorMessage = errorMessages.join('. ');
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateStrategy = async (id: number, data: Partial<CreateStrategyData>): Promise<Strategy | null> => {
    try {
      const updatedStrategy = await strategyService.updateStrategy(id, data);
      setStrategies(prev => 
        Array.isArray(prev) 
          ? prev.map(strategy => strategy.id === id ? updatedStrategy : strategy)
          : [updatedStrategy]
      );
      toast({
        title: "✅ Strategy Updated!",
        description: `"${updatedStrategy.name}" has been successfully updated.`,
        duration: 4000,
      });
      return updatedStrategy;
    } catch (err: any) {
      let errorMessage = "Failed to update strategy";
      
      if (err.errors && Object.keys(err.errors).length > 0) {
        const errorMessages = Object.values(err.errors).flat() as string[];
        errorMessage = errorMessages.join('. ');
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteStrategy = async (id: number): Promise<boolean> => {
    try {
      const strategyToDelete = Array.isArray(strategies) 
        ? strategies.find(s => s.id === id) 
        : null;
      
      await strategyService.deleteStrategy(id);
      setStrategies(prev => Array.isArray(prev) ? prev.filter(strategy => strategy.id !== id) : []);
      
      toast({
        title: "🗑️ Strategy Deleted",
        description: `"${strategyToDelete?.name || 'Strategy'}" has been permanently removed.`,
        duration: 4000,
      });
      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete strategy",
        variant: "destructive",
      });
      return false;
    }
  };

  const refreshStrategies = () => {
    fetchStrategies();
  };

  return {
    strategies,
    loading,
    error,
    meta,
    createStrategy,
    updateStrategy,
    deleteStrategy,
    refreshStrategies,
  };
}

export function useStrategy(id: string | number) {
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStrategy = async () => {
      try {
        setLoading(true);
        setError(null);
        const numericId = typeof id === 'string' ? parseInt(id) : id;
        const data = await strategyService.getStrategy(numericId);
        setStrategy(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch strategy');
        toast({
          title: "Error",
          description: "Failed to load strategy",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStrategy();
    }
  }, [id, toast]);

  return { strategy, loading, error };
}