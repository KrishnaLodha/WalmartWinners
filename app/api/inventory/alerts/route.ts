import { NextResponse } from "next/server"

// Mock alerts data
const generateAlerts = () => {
  const alerts = [
    {
      id: "alert-1",
      type: "stock_critical",
      priority: "high",
      product_id: "5",
      product_name: "Nike Air Max 270",
      sku: "NIKE-AM270-BLK-10",
      warehouse: "Midwest Center",
      title: "Critical Stock Alert",
      message: "Product is out of stock and requires immediate attention",
      description: "This item has zero stock remaining and high demand forecast",
      action: "Reorder immediately or redistribute from other warehouses",
      severity: "critical",
      ml_confidence: 0.95,
      status: "active",
      created_at: new Date().toISOString(),
    },
    {
      id: "alert-2",
      type: "stock_low",
      priority: "medium",
      product_id: "3",
      product_name: "MacBook Air M3",
      sku: "APPL-MBA-M3-512",
      warehouse: "Main Distribution Center",
      title: "Low Stock Warning",
      message: "Stock level below reorder point",
      description: "Current stock (8) is below reorder point (10)",
      action: "Consider reordering or redistributing stock",
      severity: "warning",
      ml_confidence: 0.87,
      status: "active",
      created_at: new Date().toISOString(),
    },
    {
      id: "alert-3",
      type: "overstock",
      priority: "low",
      product_id: "4",
      product_name: "Sony WH-1000XM5",
      sku: "SONY-WH1000XM5",
      warehouse: "East Coast Facility",
      title: "Overstock Alert",
      message: "Stock level exceeds maximum capacity",
      description: "Current stock (120) exceeds maximum (100)",
      action: "Consider redistributing excess stock to other warehouses",
      severity: "info",
      ml_confidence: 0.92,
      status: "active",
      created_at: new Date().toISOString(),
    },
    {
      id: "alert-4",
      type: "demand_spike",
      priority: "medium",
      product_id: "1",
      product_name: "iPhone 15 Pro",
      sku: "APPL-IP15P-128",
      warehouse: "Main Distribution Center",
      title: "Demand Spike Detected",
      message: "AI detected unusual demand pattern",
      description: "Forecasted demand increased by 40% for next week",
      action: "Prepare additional stock or adjust pricing",
      severity: "warning",
      ml_confidence: 0.78,
      status: "active",
      created_at: new Date().toISOString(),
    },
    {
      id: "alert-5",
      type: "supplier_delay",
      priority: "high",
      product_id: "2",
      product_name: "Samsung Galaxy S24",
      sku: "SAMS-GS24-256",
      warehouse: "West Coast Hub",
      title: "Supplier Delay Risk",
      message: "Potential supplier delay detected",
      description: "Lead time may increase due to supply chain issues",
      action: "Contact supplier or find alternative sources",
      severity: "warning",
      ml_confidence: 0.83,
      status: "active",
      created_at: new Date().toISOString(),
    },
  ]

  return alerts
}

export async function GET() {
  try {
    const alerts = generateAlerts()
    return NextResponse.json(alerts)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
