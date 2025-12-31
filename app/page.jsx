'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"

export default function Page() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user has a token
        const hasToken = authService.isAuthenticated()
        
        if (hasToken) {
          // Optional: Validate token with server
          // const isValid = await authService.validateToken()
          // if (isValid) {
          //   router.replace('/dashboards/dashboard')
          // } else {
          //   router.replace('/login')
          // }
          
          // For now, just check if token exists
          router.replace('/dashboards/dashboard')
        } else {
          router.replace('/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.replace('/login')
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [router])

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return null
}
