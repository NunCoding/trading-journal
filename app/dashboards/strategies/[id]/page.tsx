"use client"

import { use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, Target, TrendingUp, Zap, Activity, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useStrategy } from "@/hooks/use-strategies"

// Mock data for charts (will be replaced with real data later)
const performanceData = [
  { date: "2023-01", equity: 10000 },
  { date: "2023-02", equity: 10500 },
  { date: "2023-03", equity: 10200 },
  { date: "2023-04", equity: 11200 },
  { date: "2023-05", equity: 11800 },
  { date: "2023-06", equity: 12500 },
]

const monthlyReturns = [
  { month: "Jan", returns: 5.0 },
  { month: "Feb", returns: -3.0 },
  { month: "Mar", returns: 10.0 },
  { month: "Apr", returns: 5.4 },
  { month: "May", returns: 6.2 },
  { month: "Jun", returns: 4.1 },
]

const recentTrades = [
  { id: 1, date: "2024-01-15", pair: "BTC/USD", side: "Long", pnl: 450, rr: 2.8, status: "win" },
  { id: 2, date: "2024-01-14", pair: "ETH/USD", side: "Long", pnl: -120, rr: -1.0, status: "loss" },
  { id: 3, date: "2024-01-12", pair: "BTC/USD", side: "Short", pnl: 680, rr: 3.4, status: "win" },
  { id: 4, date: "2024-01-10", pair: "BTC/USD", side: "Long", pnl: 320, rr: 2.1, status: "win" },
]

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

export default function StrategyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { strategy, loading, error } = useStrategy(resolvedParams.id)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading strategy details...</p>
        </div>
      </div>
    )
  }

  if (error || !strategy) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Target className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-lg font-semibold">Strategy not found</h3>
          <p className="text-muted-foreground">{error || "The strategy you're looking for doesn't exist."}</p>
          <Button asChild>
            <Link href="/dashboards/strategies">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Strategies
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const strategyName = strategy.name || 'Unnamed Strategy'
  const strategyDescription = strategy.description || 'No description'
  const strategyStatus = strategy.status || 'unknown'
  const timeframes = strategy.timeframes || []
  const symbols = strategy.symbols || []
  const riskPerTrade = parseFloat(strategy.risk_per_trade) || 0
  const minRR = parseFloat(strategy.min_rr_ratio) || 0
  const maxRR = parseFloat(strategy.max_rr_ratio) || 0
  const entryRules = strategy.entry_rules || 'No entry rules defined'
  const exitRules = strategy.exit_rules || 'No exit rules defined'
  const tradesCount = strategy.trades_count || 0

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="hover:bg-white/5">
          <Link href="/dashboards/strategies">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{strategyName}</h1>
            <Badge className={getStatusColor(strategyStatus)}>
              {strategyStatus.charAt(0).toUpperCase() + strategyStatus.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground">{strategyDescription}</p>
        </div>
        <Button variant="outline" className="glass-card bg-transparent border-white/10 hover:border-primary/50">
          <Edit className="mr-2 h-4 w-4" />
          Edit Strategy
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Trades", value: tradesCount.toString(), sub: "All time", icon: Target, color: "text-primary" },
          { label: "Win Rate", value: strategy.win_rate ? `${strategy.win_rate}%` : "N/A", sub: "Based on closed trades", icon: TrendingUp, color: "text-success" },
          { label: "Risk/Trade", value: `${riskPerTrade}%`, sub: `R:R Target: ${minRR} - ${maxRR}`, icon: Activity, color: "text-blue-400" },
          { label: "Status", value: strategyStatus.charAt(0).toUpperCase() + strategyStatus.slice(1), sub: strategy.is_active ? "Currently active" : "Inactive", icon: Zap, color: strategy.is_active ? "text-success" : "text-muted-foreground" },
        ].map((stat, i) => (
          <Card key={i} className="glass-card border-white/10 hover:border-primary/30 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="glass-card bg-white/5 border-white/10 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="rules">Entry Rules</TabsTrigger>
          <TabsTrigger value="performance">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-4 glass-card border-white/10">
              <CardHeader>
                <CardTitle>Equity Growth</CardTitle>
                <CardDescription>Performance of this strategy over time.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{ equity: { label: "Equity", color: "hsl(var(--primary))" } }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="equity" stroke="var(--color-equity)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-equity)", strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="md:col-span-3 glass-card border-white/10">
              <CardHeader>
                <CardTitle>Strategy Parameters</CardTitle>
                <CardDescription>Core rules and constraints.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Timeframes</h4>
                  <div className="flex gap-2 flex-wrap">
                    {timeframes.length > 0 ? timeframes.map((tf, index) => (
                      <Badge key={index} variant="outline" className="bg-white/5 border-white/10">{tf}</Badge>
                    )) : <span className="text-sm text-muted-foreground">Not specified</span>}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Assets</h4>
                  <div className="flex gap-2 flex-wrap">
                    {symbols.length > 0 ? symbols.map((symbol, index) => (
                      <Badge key={index} variant="outline" className="bg-white/5 border-white/10">{symbol}</Badge>
                    )) : <span className="text-sm text-muted-foreground">Not specified</span>}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Risk per Trade</h4>
                  <p className="text-sm font-semibold">{riskPerTrade}% (Hard Limit)</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Target R:R</h4>
                  <p className="text-sm font-semibold">{minRR} - {maxRR}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Created</h4>
                  <p className="text-sm font-semibold">{strategy.created_at ? new Date(strategy.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>Latest trades executed using this strategy. ({tradesCount} total)</CardDescription>
            </CardHeader>
            <CardContent>
              {tradesCount > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-white/5">
                      <TableHead className="text-muted-foreground uppercase text-xs">Date</TableHead>
                      <TableHead className="text-muted-foreground uppercase text-xs">Pair</TableHead>
                      <TableHead className="text-muted-foreground uppercase text-xs">Side</TableHead>
                      <TableHead className="text-muted-foreground uppercase text-xs text-right">P&L</TableHead>
                      <TableHead className="text-muted-foreground uppercase text-xs text-right">R:R</TableHead>
                      <TableHead className="text-muted-foreground uppercase text-xs text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTrades.map((trade) => (
                      <TableRow key={trade.id} className="border-white/5 hover:bg-white/5">
                        <TableCell className="font-mono text-sm">{trade.date}</TableCell>
                        <TableCell className="font-semibold">{trade.pair}</TableCell>
                        <TableCell><Badge variant="outline" className="bg-white/5 border-white/10">{trade.side}</Badge></TableCell>
                        <TableCell className="text-right font-semibold">
                          <span className={trade.pnl > 0 ? "text-success" : "text-destructive"}>{trade.pnl > 0 ? "+" : ""}${trade.pnl}</span>
                        </TableCell>
                        <TableCell className="text-right font-mono">{trade.rr.toFixed(1)}R</TableCell>
                        <TableCell className="text-right">
                          {trade.status === "win" ? <ArrowUpRight className="h-4 w-4 text-success ml-auto" /> : <ArrowDownRight className="h-4 w-4 text-destructive ml-auto" />}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No trades yet</h3>
                  <p className="text-muted-foreground">Start trading with this strategy to see your trade history here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Entry Rules</CardTitle>
                <CardDescription>Conditions required for opening a position.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entryRules}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Exit Rules</CardTitle>
                <CardDescription>Risk management and profit-taking strategy.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{exitRules}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Monthly Returns</CardTitle>
              <CardDescription>Month-over-month performance breakdown.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ChartContainer config={{ returns: { label: "Returns", color: "hsl(var(--primary))" } }} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="returns" fill="var(--color-returns)" radius={[4, 4, 0, 0]} className="cursor-pointer" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}