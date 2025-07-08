import { NextResponse } from "next/server"

const mockCustomers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    segment: "high_value",
    totalSpent: 2450.0,
    orderCount: 12,
    lastPurchase: "2024-01-14",
    preferences: ["Electronics", "Books"],
    loyaltyPoints: 1250,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    segment: "frequent_buyer",
    totalSpent: 890.5,
    orderCount: 8,
    lastPurchase: "2024-01-13",
    preferences: ["Clothing", "Beauty"],
    loyaltyPoints: 445,
  },
]

export async function GET() {
  return NextResponse.json(mockCustomers)
}
