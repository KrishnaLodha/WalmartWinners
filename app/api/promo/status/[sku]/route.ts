import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { sku: string } }) {
  const { sku } = params

  // Mock promotion status data
  const mockPromoStatus = {
    sku: sku,
    promoStatus: "active",
    couponsSent: 45,
    couponsRedeemed: 12,
    conversionRate: 26.7,
    revenueGenerated: 3240.0,
    activeCoupons: [
      {
        couponCode: "WALMART20-JACKET",
        discount: 20,
        validUntil: "2024-01-22",
        customerSegment: "high_value",
        redemptions: 5,
      },
      {
        couponCode: "WALMART15-JACKET",
        discount: 15,
        validUntil: "2024-01-22",
        customerSegment: "regular",
        redemptions: 7,
      },
    ],
    insights: {
      bestPerformingDiscount: 20,
      optimalSendTime: "Tuesday 2-4 PM",
      topCustomerSegment: "high_value",
      recommendedActions: ["Increase discount to 25%", "Target more frequent buyers", "Send reminder SMS"],
    },
  }

  return NextResponse.json(mockPromoStatus)
}
