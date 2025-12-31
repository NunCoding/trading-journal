"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Target, TrendingUp, Zap, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
import { useState, useMemo } from "react"
import { useStrategies } from "@/hooks/use-strategies"
import { CreateStrategyData } from "@/lib/strategy"
import { useToast } from "@/hooks/use-toast"

const getStrategyIcon = (name: string | undefined | null) => {
  if (!name) return TrendingUp;
  if (name.toLowerCase().includes('breakout')) return Zap;
  if (name.toLowerCase().includes('reversion')) return Target;
  return TrendingUp;
};

const getStatusColor = (status: string | undefined | null) => {
  if (!status) return "";
  switch (status) {
    case 'active':
      return "bg-success/20 text-success border-success/30";
    case 'testing':
      return "bg-warning/20 text-warning border-warning/30";
    case 'paused':
      return "bg-muted/20 text-muted-foreground border-muted/30";
    default:
      return "";
  }
};

export default function StrategiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()
  
  // Form state
  const [formData, setFormData] = useState<CreateStrategyData>({
    name: '',
    description: '',
    status: 'testing',
    timeframes: ['4h'],
    symbols: [''],
    risk_per_trade: 1.0,
    min_rr_ratio: 2.0,
    max_rr_ratio: 5.0,
    entry_rules: '',
    exit_rules: '',
  })

  const { strategies, loading, createStrategy, refreshStrategies } = useStrategies({
    search: searchTerm || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter || undefined,
  })

  const filteredStrategies = useMemo(() => {
    if (!strategies || !Array.isArray(strategies)) {
      return [];
    }
    
    return strategies.filter((strategy) => {
      if (!strategy) return false;
      
      const strategyName = strategy.name || '';
      const strategyDescription = strategy.description || '';
      const strategyStatus = strategy.status || '';
      
      const matchesSearch = !searchTerm || 
        strategyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        strategyDescription.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || statusFilter === 'all' || strategyStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [strategies, searchTerm, statusFilter]);

  const handleInputChange = (field: keyof CreateStrategyData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreateStrategy = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const result = await createStrategy(formData)
      if (result) {
        setIsDialogOpen(false)
        // Reset form
        setFormData({
          name: '',
          description: '',
          status: 'testing',
          timeframes: ['4h'],
          symbols: [''],
          risk_per_trade: 1.0,
          min_rr_ratio: 2.0,
          max_rr_ratio: 5.0,
          entry_rules: '',
          exit_rules: '',
        })
      }
    } finally {
      setIsCreating(false)
    }
  }

  if (loading) {
    return;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Strategies</h1>
          <p className="text-muted-foreground">Manage and track your trading methodologies.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="neon-glow bg-primary hover:bg-primary/90"
              onClick={() => {
                // Test toast to verify it's working
                toast({
                  title: "Dialog Opening",
                  description: "Create strategy dialog is opening...",
                  duration: 2000,
                });
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Strategy
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Create New Strategy</DialogTitle>
              <DialogDescription>
                Define your trading methodology with entry rules, risk parameters, and performance tracking.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateStrategy} className="space-y-6 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Strategy Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. BTC Breakout"
                    className="glass-card bg-transparent border border-gray-300"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
                    <SelectTrigger id="status" className="w-full glass-card bg-transparent border border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border border-gray-300">
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your strategy methodology, setup conditions, and trading rules..."
                  className="glass-card bg-transparent border border-gray-300 min-h-24"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Select 
                    value={formData.timeframes[0] || '4h'} 
                    onValueChange={(value) => handleInputChange('timeframes', [value])}
                  >
                    <SelectTrigger id="timeframe" className="glass-card w-full bg-transparent border border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border border-gray-300">
                      <SelectItem value="M1">1 Minute</SelectItem>
                      <SelectItem value="M5">5 Minutes</SelectItem>
                      <SelectItem value="M15">15 Minutes</SelectItem>
                      <SelectItem value="H1">1 Hour</SelectItem>
                      <SelectItem value="H4">4 Hours</SelectItem>
                      <SelectItem value="D1">Daily</SelectItem>
                      <SelectItem value="W1">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symbol">Primary Asset</Label>
                  <Input
                    id="symbol"
                    placeholder="e.g. BTCUSDT, XAUUSD"
                    className="glass-card bg-transparent border border-gray-300"
                    value={formData.symbols[0] || ''}
                    onChange={(e) => handleInputChange('symbols', [e.target.value])}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="risk">Risk Per Trade (%)</Label>
                  <Input
                    id="risk"
                    type="number"
                    step="0.1"
                    placeholder="1.0"
                    className="glass-card bg-transparent border border-gray-300"
                    value={formData.risk_per_trade}
                    onChange={(e) => handleInputChange('risk_per_trade', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-rr">Min R:R Ratio</Label>
                  <Input
                    id="min-rr"
                    type="number"
                    step="0.1"
                    placeholder="2.0"
                    className="glass-card bg-transparent border border-gray-300"
                    value={formData.min_rr_ratio}
                    onChange={(e) => handleInputChange('min_rr_ratio', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-rr">Max R:R Ratio</Label>
                  <Input
                    id="max-rr"
                    type="number"
                    step="0.1"
                    placeholder="5.0"
                    className="glass-card bg-transparent border border-gray-300"
                    value={formData.max_rr_ratio}
                    onChange={(e) => handleInputChange('max_rr_ratio', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry-rules">Entry Rules</Label>
                <Textarea
                  id="entry-rules"
                  placeholder="Define your entry conditions, indicators, and confirmation signals..."
                  className="glass-card bg-transparent border border-gray-300 min-h-20"
                  value={formData.entry_rules}
                  onChange={(e) => handleInputChange('entry_rules', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exit-rules">Exit Rules</Label>
                <Textarea
                  id="exit-rules"
                  placeholder="Define your exit strategy, stop loss, and take profit rules..."
                  className="glass-card bg-transparent border border-gray-300 min-h-20"
                  value={formData.exit_rules}
                  onChange={(e) => handleInputChange('exit_rules', e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="glass-card bg-transparent border border-gray-300"
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="neon-glow bg-primary hover:bg-primary/90"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Strategy'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search strategies..."
            className="pl-10 glass-card bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="glass-card bg-transparent">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="testing">Testing</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStrategies.map((strategy) => {
          if (!strategy) return null;
          
          const IconComponent = getStrategyIcon(strategy.name);
          const strategyName = strategy.name || 'Unnamed Strategy';
          const strategyDescription = strategy.description || 'No description';
          const strategyStatus = strategy.status || 'unknown';
          const timeframes = strategy.timeframes || [];
          const symbols = strategy.symbols || [];
          const riskPerTrade = parseFloat(strategy.risk_per_trade) || 0;
          
          return (
            <Card
              key={strategy.id}
              className="flex flex-col glass-card border border-gray-300 hover:border-primary/50 transition-colors group"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="rounded-full bg-primary/10 p-2 text-primary group-hover:neon-glow">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(strategyStatus)}
                  >
                    {strategyStatus.charAt(0).toUpperCase() + strategyStatus.slice(1)}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{strategyName}</CardTitle>
                <CardDescription className="line-clamp-2">{strategyDescription}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Symbols</span>
                    <div className="font-semibold text-sm">
                      {symbols.length > 0 ? symbols.join(', ') : 'N/A'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Timeframes</span>
                    <div className="font-semibold text-sm">
                      {timeframes.length > 0 ? timeframes.join(', ') : 'N/A'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Total Trades</span>
                    <div className="font-semibold">{strategy.trades_count || 0}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Risk/Trade</span>
                    <div className="font-semibold">{riskPerTrade}%</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-white/5">
                <Button
                  variant="outline"
                  className="w-full bg-transparent border border-gray-300 hover:border-primary/50 group-hover:bg-primary/5"
                  asChild
                >
                  <Link href={`/dashboards/strategies/${strategy.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredStrategies.length === 0 && !loading && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No strategies found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || (statusFilter && statusFilter !== 'all')
              ? "Try adjusting your search or filter criteria"
              : "Create your first trading strategy to get started"
            }
          </p>
          {!searchTerm && (!statusFilter || statusFilter === 'all') && (
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Strategy
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
