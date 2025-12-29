"use client"

import type { ChartConfig } from "@/components/ui/chart"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { TrendingUp, Target, Clock, PieChart } from "lucide-react"

const equityData = [
  { date: "Mar 01", equity: 10000 },
  { date: "Mar 05", equity: 10500 },
  { date: "Mar 10", equity: 10200 },
  { date: "Mar 15", equity: 11200 },
  { date: "Mar 20", equity: 10800 },
  { date: "Mar 25", equity: 12450 },
]

const weekdayPerformance = [
  { day: "Mon", profit: 1200 },
  { day: "Tue", profit: -400 },
  { day: "Wed", profit: 800 },
  { day: "Thu", profit: 1500 },
  { day: "Fri", profit: -200 },
]

const equityConfig = {
  equity: {
    label: "Equity",
    color: "hsl(var(--primary))",
  },
}

const performanceConfig = {
  profit: {
    label: "Profit/Loss",
    color: "hsl(var(--success))",
  },
} satisfies ChartConfig

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 grid-pattern">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold tracking-tight">Performance Analytics</h1>
          <Badge variant="outline" className="neon-glow text-primary border-primary/50">
            ADVANCED
          </Badge>
        </div>
        <p className="text-muted-foreground text-lg">
          Comprehensive analysis of your trading edge and execution quality.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="col-span-full glass border-primary/20 neon-glow">
          <CardHeader className="border-b border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Equity Curve
                </CardTitle>
                <CardDescription className="mt-1">
                  Visual representation of your account growth trajectory
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-success font-semibold">
                +24.5% ROI
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={equityConfig} className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="equity"
                    stroke="hsl(var(--primary))"
                    fill="url(#equityGradient)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="border-b border-border/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="h-4 w-4 text-warning" />
              Day of Week Performance
            </CardTitle>
            <CardDescription>Profit/loss distribution across trading days</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={performanceConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekdayPerformance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="profit" radius={[8, 8, 0, 0]} fill="hsl(var(--success))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="border-b border-border/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-4 w-4 text-success" />
              Key Performance Indicators
            </CardTitle>
            <CardDescription>Quantitative metrics measuring trading quality</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/20 border border-border/30">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Profit Factor</span>
                <span className="font-bold text-lg">2.45</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/20 border border-border/30">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Expectancy</span>
                <span className="font-bold text-lg text-success">+$87.68</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/20 border border-border/30">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Max Drawdown</span>
                <span className="font-bold text-lg text-destructive">-8.4%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/20 border border-border/30">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Avg. Hold Time
                </span>
                <span className="font-bold text-lg">4h 12m</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/20 border border-border/30">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Std. Deviation
                </span>
                <span className="font-bold text-lg">1.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
