import type React from "react"
import { TopNavbar } from "@/components/top-navbar"

export default function AlertsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
