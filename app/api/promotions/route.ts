import { NextResponse } from "next/server"

const mockPromotions = [
  {
    id: "1",
    name: "Winter Clearance Sale",
    type: "percentage",
    value: 30,
    status: "active",
    startDate: "2024-01-10",
    endDate: "2024-01-31",
    targetSegment: "all_customers",
    products: ["Winter Jackets", "Boots", "Scarves"],
    performance: {
      impressions: 15420,
      clicks: 892,
      conversions: 156,
      revenue: 12450.0,
    },
  },
  {
    id: "2",
    name: "Electronics Bundle Deal",
    type: "bundle",
    value: 200,
    status: "scheduled",
    startDate: "2024-01-20",
    endDate: "2024-02-05",
    targetSegment: "tech_enthusiasts",
    products: ["iPhone", "AirPods", "MacBook"],
    performance: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
    },
  },
]

export async function GET() {
  return NextResponse.json(mockPromotions)
}

export async function POST(request: Request) {
  const data = await request.json()

  const newPromotion = {
    id: Date.now().toString(),
    ...data,
    status: "draft",
    performance: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
    },
  }

  return NextResponse.json(newPromotion, { status: 201 })
}
