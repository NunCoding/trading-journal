"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { tradeService, Account, Strategy, TradeTag, CreateTradeData } from "@/lib/trade"
import { useToast } from "@/hooks/use-toast"

export default function NewTradePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  
  const [accounts, setAccounts] = useState<Account[]>([])
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [tradeTags, setTradeTags] = useState<TradeTag[]>([])

  const [formData, setFormData] = useState({
    account_id: "",
    symbol: "",
    market_type: "",
    direction: "",
    entry_price: "",
    exit_price: "",
    stop_loss: "",
    take_profit: "",
    lot_size: "",
    risk_percent: "",
    risk_amount: "",
    open_time: "",
    close_time: "",
    session: "",
    timeframe: "",
    strategy_id: "",
    notes: "",
    tags: [] as string[],
  })

  // Fetch dropdown data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsRes, strategiesRes, tagsRes] = await Promise.all([
          tradeService.getAccounts(),
          tradeService.getStrategies(),
          tradeService.getTradeTags(),
        ])
        setAccounts(accountsRes)
        setStrategies(strategiesRes)
        setTradeTags(tagsRes)
      } catch (error) {
        console.error("Failed to fetch form data:", error)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      // Build payload, only include non-empty values
      const payload: CreateTradeData = {
        account_id: formData.account_id,
        symbol: formData.symbol,
        market_type: formData.market_type as CreateTradeData['market_type'],
        direction: formData.direction as CreateTradeData['direction'],
        entry_price: parseFloat(formData.entry_price),
        lot_size: parseFloat(formData.lot_size),
        open_time: formData.open_time,
      }

      // Add optional fields if they have values
      if (formData.exit_price) payload.exit_price = parseFloat(formData.exit_price)
      if (formData.stop_loss) payload.stop_loss = parseFloat(formData.stop_loss)
      if (formData.take_profit) payload.take_profit = parseFloat(formData.take_profit)
      if (formData.risk_percent) payload.risk_percent = parseFloat(formData.risk_percent)
      if (formData.risk_amount) payload.risk_amount = parseFloat(formData.risk_amount)
      if (formData.close_time) payload.close_time = formData.close_time
      if (formData.session) payload.session = formData.session as CreateTradeData['session']
      if (formData.timeframe) payload.timeframe = formData.timeframe
      if (formData.strategy_id) payload.strategy_id = formData.strategy_id
      if (formData.notes) payload.notes = formData.notes
      if (formData.tags.length > 0) payload.tags = formData.tags

      await tradeService.createTrade(payload)

      toast({
        title: "Trade created",
        description: "Your trade has been saved successfully.",
      })

      router.push("/dashboards/trades")
    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors)
      }
      toast({
        title: "Error",
        description: error.message || "Failed to create trade",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePips = () => {
    const entry = parseFloat(formData.entry_price) || 0
    const sl = parseFloat(formData.stop_loss) || 0
    const tp = parseFloat(formData.take_profit) || 0

    // Determine pip multiplier based on symbol (JPY pairs use 100, others use 10000)
    const isJPYPair = formData.symbol.toUpperCase().includes("JPY")
    const pipMultiplier = isJPYPair ? 100 : 10000

    const slPips = entry && sl ? Math.abs(entry - sl) * pipMultiplier : 0
    const tpPips = entry && tp ? Math.abs(tp - entry) * pipMultiplier : 0

    return {
      slPips: slPips.toFixed(1),
      tpPips: tpPips.toFixed(1),
    }
  }

  const { slPips, tpPips } = calculatePips()

  const getFieldError = (field: string) => errors[field]?.[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboards/trades">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Trade</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trade Details</CardTitle>
              <CardDescription>Enter the basic information about your trade entry.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Account & Symbol */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="account_id">Account *</Label>
                  <Select
                    value={formData.account_id}
                    onValueChange={(value) => setFormData({ ...formData, account_id: value })}
                  >
                    <SelectTrigger id="account_id" className={`w-full ${errors.account_id ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={String(account.id)} value={String(account.id)}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFieldError("account_id") && (
                    <p className="text-sm text-red-500">{getFieldError("account_id")}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symbol">Symbol *</Label>
                  <Input
                    id="symbol"
                    placeholder="e.g. EUR/USD, BTC/USDT"
                    maxLength={20}
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    className={errors.symbol ? "border-red-500" : ""}
                  />
                  {getFieldError("symbol") && (
                    <p className="text-sm text-red-500">{getFieldError("symbol")}</p>
                  )}
                </div>
              </div>

              {/* Market Type & Direction */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="market_type">Market Type *</Label>
                  <Select
                    value={formData.market_type}
                    onValueChange={(value) => setFormData({ ...formData, market_type: value })}
                  >
                    <SelectTrigger id="market_type" className={`w-full ${errors.market_type ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select market type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forex">Forex</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                      <SelectItem value="stock">Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  {getFieldError("market_type") && (
                    <p className="text-sm text-red-500">{getFieldError("market_type")}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direction">Direction *</Label>
                  <Select
                    value={formData.direction}
                    onValueChange={(value) => setFormData({ ...formData, direction: value })}
                  >
                    <SelectTrigger id="direction" className={`w-full ${errors.direction ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy (Long)</SelectItem>
                      <SelectItem value="sell">Sell (Short)</SelectItem>
                    </SelectContent>
                  </Select>
                  {getFieldError("direction") && (
                    <p className="text-sm text-red-500">{getFieldError("direction")}</p>
                  )}
                </div>
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entry_price">Entry Price *</Label>
                  <Input
                    id="entry_price"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="0.00"
                    value={formData.entry_price}
                    onChange={(e) => setFormData({ ...formData, entry_price: e.target.value })}
                    className={errors.entry_price ? "border-red-500" : ""}
                  />
                  {getFieldError("entry_price") && (
                    <p className="text-sm text-red-500">{getFieldError("entry_price")}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exit_price">Exit Price</Label>
                  <Input
                    id="exit_price"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="0.00"
                    value={formData.exit_price}
                    onChange={(e) => setFormData({ ...formData, exit_price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stop_loss">Stop Loss</Label>
                  <Input
                    id="stop_loss"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="0.00"
                    value={formData.stop_loss}
                    onChange={(e) => setFormData({ ...formData, stop_loss: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="take_profit">Take Profit</Label>
                  <Input
                    id="take_profit"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="0.00"
                    value={formData.take_profit}
                    onChange={(e) => setFormData({ ...formData, take_profit: e.target.value })}
                  />
                </div>
              </div>

              {/* Lot Size */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="lot_size">Lot Size *</Label>
                  <Input
                    id="lot_size"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="0.01"
                    value={formData.lot_size}
                    onChange={(e) => setFormData({ ...formData, lot_size: e.target.value })}
                    className={errors.lot_size ? "border-red-500" : ""}
                  />
                  {getFieldError("lot_size") && (
                    <p className="text-sm text-red-500">{getFieldError("lot_size")}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Input
                    id="timeframe"
                    placeholder="e.g. 1H, 4H, D1"
                    maxLength={10}
                    value={formData.timeframe}
                    onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                  />
                </div>
              </div>

              {/* Time Fields */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="open_time">Open Time *</Label>
                  <Input
                    id="open_time"
                    type="datetime-local"
                    value={formData.open_time}
                    onChange={(e) => setFormData({ ...formData, open_time: e.target.value })}
                    className={errors.open_time ? "border-red-500" : ""}
                  />
                  {getFieldError("open_time") && (
                    <p className="text-sm text-red-500">{getFieldError("open_time")}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="close_time">Close Time</Label>
                  <Input
                    id="close_time"
                    type="datetime-local"
                    value={formData.close_time}
                    onChange={(e) => setFormData({ ...formData, close_time: e.target.value })}
                  />
                </div>
              </div>

              {/* Session & Strategy */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="session">Session</Label>
                  <Select
                    value={formData.session}
                    onValueChange={(value) => setFormData({ ...formData, session: value })}
                  >
                    <SelectTrigger id="session" className="w-full">
                      <SelectValue placeholder="Select session" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia">Asia</SelectItem>
                      <SelectItem value="london">London</SelectItem>
                      <SelectItem value="newyork">New York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="strategy_id">Strategy</Label>
                  <Select
                    value={formData.strategy_id}
                    onValueChange={(value) => setFormData({ ...formData, strategy_id: value })}
                  >
                    <SelectTrigger id="strategy_id" className="w-full">
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      {strategies.map((strategy) => (
                        <SelectItem key={String(strategy.id)} value={String(strategy.id)}>
                          {strategy.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes & Tags</CardTitle>
              <CardDescription>Document your thought process and categorize your trade.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="What was the reason for entry? How were you feeling during the trade?"
                  className="min-h-[120px]"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {tradeTags.map((tag) => (
                    <Button
                      key={String(tag.id)}
                      type="button"
                      variant={formData.tags.includes(String(tag.id)) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const tagId = String(tag.id)
                        const newTags = formData.tags.includes(tagId)
                          ? formData.tags.filter((t) => t !== tagId)
                          : [...formData.tags, tagId]
                        setFormData({ ...formData, tags: newTags })
                      }}
                    >
                      {tag.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="risk_percent">Risk (%)</Label>
                <Input
                  id="risk_percent"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="1.0"
                  value={formData.risk_percent}
                  onChange={(e) => setFormData({ ...formData, risk_percent: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="risk_amount">Risk Amount ($)</Label>
                <Input
                  id="risk_amount"
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0.00"
                  value={formData.risk_amount}
                  onChange={(e) => setFormData({ ...formData, risk_amount: e.target.value })}
                />
              </div>
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">SL Pips:</span>
                  <span className="font-medium text-red-500">{slPips}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">TP Pips:</span>
                  <span className="font-medium text-green-500">{tpPips}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Trade
          </Button>
          <Button variant="outline" className="w-full bg-transparent" asChild disabled={isLoading}>
            <Link href="/dashboards/trades">Cancel</Link>
          </Button>
        </div>
      </div>
    </form>
  )
}
