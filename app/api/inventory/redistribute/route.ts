import { type NextRequest, NextResponse } from "next/server"

// Mock redistribution logs
const redistributionLogs = [
  {
    id: "1",
    from_warehouse: "Main Distribution Center",
    to_warehouse: "West Coast Hub",
    product_name: "iPhone 15 Pro",
    sku: "APPL-IP15P-128",
    quantity_transferred: 15,
    reason: "High demand forecast in West Coast region",
    estimated_savings: 2500.0,
    status: "completed",
    created_at: "2024-01-15T10:30:00Z",
    executed_by: "AI System",
  },
  {
    id: "2",
    from_warehouse: "East Coast Facility",
    to_warehouse: "Midwest Center",
    product_name: "Samsung Galaxy S24",
    sku: "SAMS-GS24-256",
    quantity_transferred: 8,
    reason: "Overstock in East Coast, shortage in Midwest",
    estimated_savings: 1200.0,
    status: "completed",
    created_at: "2024-01-15T09:15:00Z",
    executed_by: "AI System",
  },
]

export async function POST(request: NextRequest) {
  try {
    // Simulate AI redistribution process
    await new Promise((resolve) => setTimeout(resolve, 2000)) // 2 second delay for demo

    // Generate mock redistribution results
    const newRedistributions = [
      {
        id: (redistributionLogs.length + 1).toString(),
        from_warehouse: "East Coast Facility",
        to_warehouse: "Midwest Center",
        product_name: "Sony WH-1000XM5",
        sku: "SONY-WH1000XM5",
        quantity_transferred: 25,
        reason: "AI detected overstock in East Coast, high demand in Midwest",
        estimated_savings: 3750.0,
        status: "completed",
        created_at: new Date().toISOString(),
        executed_by: "AI System",
      },
      {
        id: (redistributionLogs.length + 2).toString(),
        from_warehouse: "West Coast Hub",
        to_warehouse: "Main Distribution Center",
        product_name: "Levi's 501 Jeans",
        sku: "LEVI-501-32-BLU",
        quantity_transferred: 15,
        reason: "Balancing inventory levels across warehouses",
        estimated_savings: 1125.0,
        status: "completed",
        created_at: new Date().toISOString(),
        executed_by: "AI System",
      },
      {
        id: (redistributionLogs.length + 3).toString(),
        from_warehouse: "Main Distribution Center",
        to_warehouse: "Midwest Center",
        product_name: "iPhone 15 Pro",
        sku: "APPL-IP15P-128",
        quantity_transferred: 10,
        reason: "Predicted demand surge in Midwest region",
        estimated_savings: 2250.0,
        status: "completed",
        created_at: new Date().toISOString(),
        executed_by: "AI System",
      },
    ]

    // Add to logs
    redistributionLogs.push(...newRedistributions)

    const totalSavings = newRedistributions.reduce((sum, r) => sum + r.estimated_savings, 0)

    return NextResponse.json({
      success: true,
      redistributions: newRedistributions.length,
      totalSavings,
      message: `Successfully executed ${newRedistributions.length} redistributions`,
      details: newRedistributions,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json(redistributionLogs)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
