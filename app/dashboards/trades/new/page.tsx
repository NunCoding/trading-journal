import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewTradePage() {
  return (
    <div className="space-y-6">
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
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="pair">Trading Pair</Label>
                  <Input id="pair" placeholder="e.g. BTC/USDT" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="side">Entry Type</Label>
                  <Select>
                    <SelectTrigger id="side" className="w-full">
                      <SelectValue placeholder="Select Entry Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="long">Long</SelectItem>
                      <SelectItem value="short">Short</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="strategy">Strategy</Label>
                  <Select>
                    <SelectTrigger id="strategy" className="w-full">
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakout">Breakout</SelectItem>
                      <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                      <SelectItem value="trend-following">Trend Following</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entry">Lot Size</Label>
                  <Input id="lot_size" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entry">Entry Price</Label>
                  <Input id="entry_price" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stop-loss">Stop Loss</Label>
                  <Input id="stop-loss" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="take-profit">Take Profit</Label>
                  <Input id="take-profit" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="strategy">Strategy</Label>
                  <Select>
                    <SelectTrigger id="session" className="w-full">
                      <SelectValue placeholder="Select Session" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakout">Asian</SelectItem>
                      <SelectItem value="mean-reversion">London</SelectItem>
                      <SelectItem value="trend-following">New York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes & Psychology</CardTitle>
              <CardDescription>Document your thought process and emotional state.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What was the reason for entry? How were you feeling during the trade?"
                className="min-h-[150px]"
              />
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
                <Label htmlFor="position-size">Position Size</Label>
                <Input id="position-size" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="risk-percent">Risk (%)</Label>
                <Input id="risk-percent" type="number" placeholder="1.0" />
              </div>
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Risk:</span>
                  <span className="font-medium">$100.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Reward:</span>
                  <span className="font-medium">$250.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">R:R Ratio:</span>
                  <span className="font-medium text-success">2.5</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" size="lg">
            Save Trade
          </Button>
          <Button variant="outline" className="w-full bg-transparent" asChild>
            <Link href="/trades">Cancel</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
