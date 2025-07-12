import { NextResponse } from "next/server"

const mockSalesData = [
  {
    id: "1",
    name: "Winter Jacket - XL",
    sku: "CLTH-WJ-XL-BLU",
    category: "Clothing",
    currentStock: 85,
    expectedDemandNextWeek: 35,
    overstockPercentage: 243,
    originalPrice: 89.99,
    dynamicPrice: 71.99,
    suggestedDiscount: 20,
    promoStatus: "active",
    salesVelocity: 2.1,
    lastSaleDate: "2024-01-14",
    couponsSent: 45,
    conversionRate: 12.5,
  },
  {
    id: "2",
    name: "Summer Dress - M",
    sku: "CLTH-SD-M-RED",
    category: "Clothing",
    currentStock: 120,
    expectedDemandNextWeek: 80,
    overstockPercentage: 150,
    originalPrice: 49.99,
    dynamicPrice: 39.99,
    suggestedDiscount: 20,
    promoStatus: "sent",
    salesVelocity: 5.2,
    lastSaleDate: "2024-01-15",
    couponsSent: 28,
    conversionRate: 18.7,
  },
  // Add more mock data as needed
]

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(mockSalesData)
}
