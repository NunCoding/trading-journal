import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

const trades = [
  {
    id: "1",
    date: "2024-03-25",
    time: "14:32",
    pair: "BTC/USDT",
    side: "Long",
    entry: "$64,200",
    exit: "$66,800",
    profit: "+$2,600",
    rr: "1:2.8",
    status: "Won",
  },
  {
    id: "2",
    date: "2024-03-24",
    time: "09:15",
    pair: "ETH/USDT",
    side: "Short",
    entry: "$3,450",
    exit: "$3,510",
    profit: "-$60",
    rr: "1:0.4",
    status: "Lost",
  },
  {
    id: "3",
    date: "2024-03-24",
    time: "16:44",
    pair: "SOL/USDT",
    side: "Long",
    entry: "$185",
    exit: "$192",
    profit: "+$700",
    rr: "1:2.1",
    status: "Won",
  },
  {
    id: "4",
    date: "2024-03-23",
    time: "11:20",
    pair: "AVAX/USDT",
    side: "Short",
    entry: "$42.50",
    exit: "$41.80",
    profit: "+$350",
    rr: "1:1.8",
    status: "Won",
  },
  {
    id: "5",
    date: "2024-03-22",
    time: "08:05",
    pair: "BTC/USDT",
    side: "Long",
    entry: "$62,100",
    exit: "$61,500",
    profit: "-$600",
    rr: "1:0.3",
    status: "Lost",
  },
]

export default function TradesPage() {
  return (
    <div className="space-y-6 grid-pattern">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-balance">Trade History</h1>
          <p className="text-muted-foreground text-pretty text-lg">Review and analyze your complete trading record.</p>
        </div>
        <Button asChild className="neon-glow">
          <Link href="/dashboards/trades/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Log New Trade
          </Link>
        </Button>
      </div>

      <Card className="glass border-border/50">
        <CardHeader className="border-b border-border/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl">
              All Trades{" "}
              <Badge variant="secondary" className="ml-2">
                {trades.length}
              </Badge>
            </CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by pair, date..."
                className="pl-9 glass border-border/50 focus-visible:border-primary/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="font-semibold uppercase tracking-wider text-xs">Date</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider text-xs">Time</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider text-xs">Pair</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider text-xs">Side</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider text-xs">Entry</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider text-xs">Exit</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider text-xs">R:R</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider text-xs">P&L</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider text-xs">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow
                    key={trade.id}
                    className="border-border/20 hover:bg-accent/20 transition-colors cursor-pointer"
                  >
                    <TableCell className="font-medium">{trade.date}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{trade.time}</TableCell>
                    <TableCell className="font-semibold">{trade.pair}</TableCell>
                    <TableCell>
                      <Badge
                        variant={trade.side === "Long" ? "outline" : "secondary"}
                        className={
                          trade.side === "Long"
                            ? "border-success/50 text-success"
                            : "border-destructive/50 text-destructive"
                        }
                      >
                        {trade.side === "Long" ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {trade.side}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{trade.entry}</TableCell>
                    <TableCell className="font-mono text-sm">{trade.exit}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{trade.rr}</TableCell>
                    <TableCell
                      className={`font-bold text-base ${
                        trade.profit.startsWith("+") ? "text-success" : "text-destructive"
                      }`}
                    >
                      {trade.profit}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          trade.status === "Won"
                            ? "bg-success/90 text-success-foreground hover:bg-success border-success/50"
                            : "bg-destructive/90 text-destructive-foreground hover:bg-destructive border-destructive/50"
                        }
                      >
                        {trade.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
