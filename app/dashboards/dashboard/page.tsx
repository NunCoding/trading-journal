import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDownRight, ArrowUpRight, DollarSign, Percent, TrendingUp, Target, Activity, Zap } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6 grid-pattern">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold tracking-tight text-balance">Command Center</h1>
          <Badge variant="outline" className="neon-glow text-primary border-primary/50">
            LIVE
          </Badge>
        </div>
        <p className="text-muted-foreground text-pretty text-lg">
          Real-time performance metrics and trading analytics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-success/20 hover:border-success/40 transition-all duration-300 neon-glow-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Total P&L
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-success">+$12,450.00</div>
            <div className="flex items-center gap-1 text-xs text-success/80">
              <ArrowUpRight className="h-3 w-3" />
              <span className="font-medium">+20.1%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Win Rate
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Percent className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">64.5%</div>
            <div className="flex items-center gap-1 text-xs text-success/80">
              <ArrowUpRight className="h-3 w-3" />
              <span className="font-medium">+2.5%</span>
              <span className="text-muted-foreground">this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50 hover:border-border transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Total Trades
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">Across 4 active strategies</p>
          </CardContent>
        </Card>

        <Card className="glass border-warning/20 hover:border-warning/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Avg R:R
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-warning" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">1:2.4</div>
            <div className="flex items-center gap-1 text-xs text-destructive/80">
              <ArrowDownRight className="h-3 w-3" />
              <span className="font-medium">-0.2</span>
              <span className="text-muted-foreground">from last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="glass border-border/50 col-span-7 lg:col-span-4">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Equity Curve</CardTitle>
                <CardDescription>Performance over the last 30 days</CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Activity className="h-3 w-3" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[320px] flex items-center justify-center border border-dashed border-border/50 rounded-lg bg-muted/5">
              <div className="text-center space-y-2">
                <Zap className="h-12 w-12 mx-auto text-primary/50" />
                <p className="text-sm text-muted-foreground">Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50 col-span-7 lg:col-span-3">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Last 5 trades executed</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {[
                { pair: "BTC/USDT", type: "Long", entry: "Market", pnl: 240, time: "2h ago", win: true },
                { pair: "ETH/USDT", type: "Short", entry: "Limit", pnl: -120, time: "4h ago", win: false },
                { pair: "SOL/USDT", type: "Long", entry: "Market", pnl: 180, time: "6h ago", win: true },
                { pair: "BTC/USDT", type: "Short", entry: "Stop", pnl: -95, time: "8h ago", win: false },
                { pair: "AVAX/USDT", type: "Long", entry: "Limit", pnl: 310, time: "10h ago", win: true },
              ].map((trade, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-accent/30 border border-border/30 hover:border-border/60 transition-all"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm">{trade.pair}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-[10px] py-0 h-5">
                        {trade.type}
                      </Badge>
                      <span>{trade.entry}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className={`text-base font-bold ${trade.win ? "text-success" : "text-destructive"}`}>
                      {trade.win ? "+" : ""}${trade.pnl}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{trade.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-medium">Best Performing Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">BTC/USDT</span>
                <Badge variant="secondary" className="text-success">
                  +18.2%
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">32 trades • 71% win rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-medium">Active Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">4 Strategies</div>
              <p className="text-sm text-muted-foreground">2 momentum • 2 mean reversion</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-medium">Avg Trade Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">4.2 hours</div>
              <p className="text-sm text-muted-foreground">Optimized for intraday scalping</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
