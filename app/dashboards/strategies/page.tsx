"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Target, TrendingUp, Zap, Search } from "lucide-react"
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
import { useState } from "react"

const strategies = [
  {
    id: "1",
    name: "BTC Breakout",
    description: "Trading high-volume breakouts on the 4H timeframe for Bitcoin.",
    winRate: "68%",
    trades: 42,
    status: "Active",
    profit: "+$4,200",
    icon: Zap,
  },
  {
    id: "2",
    name: "ETH Mean Reversion",
    description: "RSI-based mean reversion strategy for Ethereum on 1H timeframe.",
    winRate: "54%",
    trades: 28,
    status: "Testing",
    profit: "+$850",
    icon: Target,
  },
  {
    id: "3",
    name: "SOL Trend Following",
    description: "EMA crossover trend following strategy for Solana.",
    winRate: "42%",
    trades: 15,
    status: "Active",
    profit: "-$120",
    icon: TrendingUp,
  },
]

export default function StrategiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredStrategies = strategies.filter((strategy) =>
    strategy.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateStrategy = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to database
    setIsDialogOpen(false)
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
            <Button className="neon-glow bg-primary hover:bg-primary/90">
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
                    className="glass-card bg-transparent border-white/10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="testing">
                    <SelectTrigger id="status" className="glass-card bg-transparent border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
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
                  className="glass-card bg-transparent border-white/10 min-h-24"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Select defaultValue="4h">
                    <SelectTrigger id="timeframe" className="glass-card bg-transparent border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      <SelectItem value="1m">1 Minute</SelectItem>
                      <SelectItem value="5m">5 Minutes</SelectItem>
                      <SelectItem value="15m">15 Minutes</SelectItem>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="4h">4 Hours</SelectItem>
                      <SelectItem value="1d">Daily</SelectItem>
                      <SelectItem value="1w">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset">Primary Asset</Label>
                  <Select defaultValue="btc">
                    <SelectTrigger id="asset" className="glass-card bg-transparent border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                      <SelectItem value="sol">Solana (SOL)</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
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
                    className="glass-card bg-transparent border-white/10"
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
                    className="glass-card bg-transparent border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-rr">Max R:R Ratio</Label>
                  <Input
                    id="max-rr"
                    type="number"
                    step="0.1"
                    placeholder="5.0"
                    className="glass-card bg-transparent border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry-rules">Entry Rules</Label>
                <Textarea
                  id="entry-rules"
                  placeholder="Define your entry conditions, indicators, and confirmation signals..."
                  className="glass-card bg-transparent border-white/10 min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exit-rules">Exit Rules</Label>
                <Textarea
                  id="exit-rules"
                  placeholder="Define your exit strategy, stop loss, and take profit rules..."
                  className="glass-card bg-transparent border-white/10 min-h-20"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="glass-card bg-transparent border-white/10"
                >
                  Cancel
                </Button>
                <Button type="submit" className="neon-glow bg-primary hover:bg-primary/90">
                  Create Strategy
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
        <Button variant="outline" className="glass-card bg-transparent">
          Filters
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStrategies.map((strategy) => (
          <Card
            key={strategy.id}
            className="flex flex-col glass-card border-white/10 hover:border-primary/50 transition-colors group"
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="rounded-full bg-primary/10 p-2 text-primary group-hover:neon-glow">
                  <strategy.icon className="h-5 w-5" />
                </div>
                <Badge
                  variant={strategy.status === "Active" ? "default" : "secondary"}
                  className={strategy.status === "Active" ? "bg-success/20 text-success border-success/30" : ""}
                >
                  {strategy.status}
                </Badge>
              </div>
              <CardTitle className="text-xl">{strategy.name}</CardTitle>
              <CardDescription className="line-clamp-2">{strategy.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Win Rate</span>
                  <div className="font-semibold">{strategy.winRate}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Profit/Loss</span>
                  <div
                    className={
                      strategy.profit.startsWith("+") ? "font-semibold text-success" : "font-semibold text-destructive"
                    }
                  >
                    {strategy.profit}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Total Trades</span>
                  <div className="font-semibold">{strategy.trades}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-white/5">
              <Button
                variant="outline"
                className="w-full bg-transparent border-white/10 hover:border-primary/50 group-hover:bg-primary/5"
                asChild
              >
                <Link href={`/strategies/${strategy.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
