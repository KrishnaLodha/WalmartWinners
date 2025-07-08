"use client"

import { useAuth } from "@/components/auth-provider"
import { LoginForm } from "@/components/login-form"
import { WalmartLandingPage } from "@/components/walmart-landing-page"
import { TopNavbar } from "@/components/top-navbar"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <WalmartLandingPage />
    </div>
  )
}
