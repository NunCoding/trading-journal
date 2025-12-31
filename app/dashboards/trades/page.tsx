"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { PlusCircle, Search, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { tradeService, Trade } from "@/lib/trade"
import { useToast } from "@/hooks/use-toast"

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const {toast} = useToast()
  const [meta, setMeta] = useState<{
    current_page: number
    last_page: number
    per_page: number
    total: number
  } | null>(null)

  const fetchTrades = async (page: number = 1, searchQuery: string = "") => {
    setIsLoading(true)
    try {
      const response = await tradeService.getTrades({
        page,
        per_page: 10,
        search: searchQuery || undefined,
      })

      if (Array.isArray(response)) {
        setTrades(response)
        setMeta(null)
      } else {
        setTrades(response.data)
        setMeta(response.meta || null)
      }
    } catch (error) {
      toast({
        title:"Failed to fetch trades",
        duration:2000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrades(currentPage, search)
  }, [currentPage])

  useEffect(() => {
    const debounce = setTimeout(() => {
      setCurrentPage(1)
      fetchTrades(1, search)
    }, 300)
    return () => clearTimeout(debounce)
  }, [search])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })
  }

  const calculatePnL = (trade: Trade) => {
    if (!trade.exit_price) return null
    const diff = trade.direction === "buy" 
      ? trade.exit_price - trade.entry_price 
      : trade.entry_price - trade.exit_price
    return diff * trade.lot_size
  }

  const getTradeStatus = (trade: Trade) => {
    if (!trade.exit_price) return "Open"
    const pnl = calculatePnL(trade)
    return pnl && pnl > 0 ? "Won" : "Lost"
  }

  return (
    <div className="space-y-6 grid-pattern">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-balance">Trade History</h1>
          <p className="text-muted-foreground text-pretty text-lg">Review and analyze your complete trading record.</p>
        </div>
        <Button asChild className="neon-glow p-6">
          <Link href="/dashboards/trades/new">
            <PlusCircle className="mr-1 h-12 w-12" />
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
                {meta?.total ?? trades.length}
              </Badge>
            </CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by symbol..."
                className="pl-9 glass border-border/50 focus-visible:border-primary/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                  <TableHead className="font-semibold uppercase tracking-wider text-xs">Symbol</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider text-xs">Market</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider text-xs">Direction</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider text-xs">Entry</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider text-xs">Exit</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider text-xs">Lot Size</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider text-xs">P&L</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider text-xs">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-border/20">
                      {Array.from({ length: 10 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : trades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No trades found. Start by logging your first trade.
                    </TableCell>
                  </TableRow>
                ) : (
                  trades.map((trade) => {
                    const pnl = calculatePnL(trade)
                    const status = getTradeStatus(trade)
                    return (
                      <TableRow
                        key={trade.id}
                        className="border-border/20 hover:bg-accent/20 transition-colors cursor-pointer"
                      >
                        <TableCell className="font-medium">{formatDate(trade.open_time)}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{formatTime(trade.open_time)}</TableCell>
                        <TableCell className="font-semibold">{trade.symbol}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {trade.market_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={trade.direction === "buy" ? "outline" : "secondary"}
                            className={
                              trade.direction === "buy"
                                ? "border-success/50 text-success"
                                : "border-destructive/50 text-destructive"
                            }
                          >
                            {trade.direction === "buy" ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {trade.direction === "buy" ? "Buy" : "Sell"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{formatPrice(trade.entry_price)}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {trade.exit_price ? formatPrice(trade.exit_price) : "-"}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{trade.lot_size}</TableCell>
                        <TableCell
                          className={`font-bold text-base ${
                            pnl === null ? "text-muted-foreground" : pnl > 0 ? "text-success" : "text-destructive"
                          }`}
                        >
                          {pnl === null ? "-" : pnl > 0 ? `+${pnl.toFixed(2)}` : pnl.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              status === "Open"
                                ? "bg-blue-500/90 text-white hover:bg-blue-500"
                                : status === "Won"
                                ? "bg-success/90 text-success-foreground hover:bg-success border-success/50"
                                : "bg-destructive/90 text-destructive-foreground hover:bg-destructive border-destructive/50"
                            }
                          >
                            {status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {meta && meta.total > 1 && (
            <div className="border-t border-border/30 p-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                    .filter((page) => {
                      return page === 1 || page === meta.last_page || Math.abs(page - currentPage) <= 1
                    })
                    .map((page, idx, arr) => (
                      <PaginationItem key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="px-2 text-muted-foreground">...</span>
                        )}
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(meta.last_page, p + 1))}
                      className={currentPage === meta.last_page ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
