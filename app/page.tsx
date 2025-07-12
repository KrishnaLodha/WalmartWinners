"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import { WalmartLandingPage } from "@/components/walmart-landing-page"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const [isSignup, setIsSignup] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <WalmartLandingPage />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isSignup ? (
          <SignupForm onToggleMode={() => setIsSignup(false)} />
        ) : (
          <LoginForm onToggleMode={() => setIsSignup(true)} />
        )}
      </div>
    </div>
  )
}
