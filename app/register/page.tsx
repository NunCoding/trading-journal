import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Lock, Mail, User, Zap } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center grid-pattern px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="rounded-2xl bg-primary/10 p-4 neon-glow border border-primary/30">
              <TrendingUp className="h-10 w-10 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">TradingOS</h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant="outline" className="text-primary border-primary/50">
                <Zap className="h-3 w-3 mr-1" />
                2026 EDITION
              </Badge>
            </div>
          </div>
        </div>

        <Card className="glass border-border/50 neon-glow">
          <CardHeader className="space-y-2 text-center border-b border-border/30">
            <CardTitle className="text-2xl font-bold tracking-tight">Start Your Journey</CardTitle>
            <CardDescription className="text-pretty text-base">
              Create your account and elevate your trading performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name" className="text-xs font-medium uppercase tracking-wide">
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="first-name"
                    placeholder="John"
                    className="pl-10 h-11 glass border-border/50 focus-visible:border-primary/50"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name" className="text-xs font-medium uppercase tracking-wide">
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="last-name"
                    placeholder="Doe"
                    className="pl-10 h-11 glass border-border/50 focus-visible:border-primary/50"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wide">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="trader@example.com"
                  className="pl-10 h-11 glass border-border/50 focus-visible:border-primary/50"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wide">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  className="pl-10 h-11 glass border-border/50 focus-visible:border-primary/50"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Must be at least 8 characters with 1 number</p>
            </div>
            <Button className="w-full h-11 neon-glow text-base font-semibold" size="lg">
              Create Account
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link href="#" className="text-primary hover:underline underline-offset-4">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline underline-offset-4">
                Privacy Policy
              </Link>
            </p>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm border-t border-border/30 pt-6">
            <span className="text-muted-foreground">Already have an account?</span>
            <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4">
              Sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
