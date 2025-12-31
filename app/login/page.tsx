"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Lock, Mail, Zap } from "lucide-react"
import { authService } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is already authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.replace('/dashboards/dashboard')
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authService.login(formData)
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to TradingOS.",
      })
      router.push('/dashboards/dashboard')
    } catch (error: any) {
      let errorTitle = "Sign in failed"
      let errorDescription = "Please check your credentials and try again."
      
      if (error.message) {
        errorDescription = error.message
        
        // If there are specific field errors, show them
        if (error.errors && Object.keys(error.errors).length > 0) {
          const errorMessages = Object.values(error.errors).flat() as string[]
          errorDescription = errorMessages.join('. ')
        }
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
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
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-pretty text-base">
              Sign in to access your trading command center
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium uppercase tracking-wide">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="trader@example.com"
                    className="pl-10 h-11 glass border-border/50 focus-visible:border-primary/50"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium uppercase tracking-wide">
                    Password
                  </Label>
                  <Link
                    href="#"
                    className="text-xs font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10 h-11 glass border-border/50 focus-visible:border-primary/50"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 neon-glow text-base font-semibold" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Launch Dashboard"}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                  <span className="bg-card px-3 text-muted-foreground font-medium">Or continue with</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full h-11 glass border-border/50 hover:border-primary/30 font-medium bg-transparent"
                type="button"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm border-t border-border/30 pt-6">
            <span className="text-muted-foreground">New to TradingOS?</span>
            <Link href="/register" className="font-semibold text-primary hover:underline underline-offset-4">
              Create account
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
