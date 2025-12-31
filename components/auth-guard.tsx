"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const hasToken = authService.isAuthenticated()
        
        if (!hasToken) {
          router.replace('/login')
          return
        }

        // Optional: Validate token with server
        // const isValid = await authService.validateToken()
        // if (!isValid) {
        //   router.replace('/login')
        //   return
        // }

        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.replace('/login')
      }
    }

    checkAuth()
  }, [router])

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      )
    )
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null
}

export default AuthGuard