import { NextResponse } from "next/server"

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const dashboardData = {
    metrics: {
      totalRevenue: 45231.89,
      totalOrders: 2350,
      inventoryItems: 12234,
      activeCustomers: 573,
    },
    salesData: [
      { date: "2024-01-08", sales: 4000, forecast: 4200 },
      { date: "2024-01-09", sales: 3000, forecast: 3100 },
      { date: "2024-01-10", sales: 2000, forecast: 2300 },
      { date: "2024-01-11", sales: 2780, forecast: 2900 },
      { date: "2024-01-12", sales: 1890, forecast: 2000 },
      { date: "2024-01-13", sales: 2390, forecast: 2500 },
      { date: "2024-01-14", sales: 3490, forecast: 3600 },
    ],
    alerts: [
      {
        id: "1",
        type: "low_stock",
        severity: "critical",
        message: "iPhone 15 Pro - Only 5 units left",
        timestamp: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        type: "overstock",
        severity: "medium",
        message: "Winter Jackets - 150% above optimal level",
        timestamp: "2024-01-15T09:15:00Z",
      },
    ],
    topProducts: [
      { name: "iPhone 15", sales: 1250, trend: "up", change: 12 },
      { name: 'Samsung TV 55"', sales: 890, trend: "up", change: 8 },
      { name: "Nike Air Max", sales: 750, trend: "down", change: -5 },
      { name: "MacBook Pro", sales: 650, trend: "up", change: 15 },
    ],
  }

  return NextResponse.json(dashboardData)
}
