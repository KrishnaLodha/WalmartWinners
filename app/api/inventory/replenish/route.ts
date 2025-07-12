import { NextResponse } from "next/server"

interface ReplenishmentRequest {
  productId: string
  quantity?: number
  urgency?: "normal" | "urgent" | "critical"
  reason?: string
}

// Mock supplier data
const suppliers = [
  {
    id: "APPLE-001",
    name: "Apple Inc.",
    reliability: 0.98,
    leadTimeDays: 7,
    minimumOrder: 10,
    contactEmail: "orders@apple.com",
  },
  {
    id: "SAMSUNG-001",
    name: "Samsung Electronics",
    reliability: 0.95,
    leadTimeDays: 5,
    minimumOrder: 5,
    contactEmail: "orders@samsung.com",
  },
  {
    id: "NIKE-001",
    name: "Nike Inc.",
    reliability: 0.92,
    leadTimeDays: 4,
    minimumOrder: 20,
    contactEmail: "orders@nike.com",
  },
  {
    id: "CLOTHING-001",
    name: "Fashion Suppliers Ltd.",
    reliability: 0.88,
    leadTimeDays: 3,
    minimumOrder: 50,
    contactEmail: "orders@fashionsuppliers.com",
  },
]

// Mock inventory data for replenishment calculations
const inventoryItems = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    sku: "APPL-IP15P-128",
    currentStock: 5,
    maxStock: 50,
    reorderPoint: 10,
    cost: 120000.0, // ₹1,20,000
    supplierId: "APPLE-001",
    demandForecast7Days: [4, 5, 6, 3, 2, 4, 5],
  },
  {
    id: "2",
    name: 'Samsung 55" QLED TV',
    sku: "SAMS-Q55-2024",
    currentStock: 25,
    maxStock: 30,
    reorderPoint: 8,
    cost: 85000.0, // ₹85,000
    supplierId: "SAMSUNG-001",
    demandForecast7Days: [2, 3, 2, 1, 2, 3, 2],
  },
  {
    id: "3",
    name: "Nike Air Max 270",
    sku: "NIKE-AM270-BLK",
    currentStock: 3,
    maxStock: 40,
    reorderPoint: 12,
    cost: 8000.0, // ₹8,000
    supplierId: "NIKE-001",
    demandForecast7Days: [3, 4, 2, 3, 4, 3, 2],
  },
  {
    id: "4",
    name: "Winter Jacket - XL",
    sku: "CLTH-WJ-XL-BLU",
    currentStock: 85,
    maxStock: 35,
    reorderPoint: 15,
    cost: 4000.0, // ₹4,000
    supplierId: "CLOTHING-001",
    demandForecast7Days: [1, 2, 1, 0, 1, 2, 1],
  },
  {
    id: "5",
    name: 'MacBook Pro 14"',
    sku: "APPL-MBP14-M3",
    currentStock: 8,
    maxStock: 20,
    reorderPoint: 5,
    cost: 180000.0, // ₹1,80,000
    supplierId: "APPLE-001",
    demandForecast7Days: [1, 1, 2, 1, 1, 2, 1],
  },
]

function calculateOptimalOrderQuantity(item: any, supplier: any) {
  const totalForecastedDemand = item.demandForecast7Days.reduce((sum: number, demand: number) => sum + demand, 0)
  const weeklyDemand = totalForecastedDemand
  const leadTimeWeeks = supplier.leadTimeDays / 7

  // Calculate safety stock (1 week of demand)
  const safetyStock = weeklyDemand

  // Calculate reorder quantity to reach max stock
  const baseOrderQuantity = item.maxStock - item.currentStock

  // Add lead time demand
  const leadTimeDemand = weeklyDemand * leadTimeWeeks

  // Calculate optimal quantity
  let optimalQuantity = Math.max(baseOrderQuantity + leadTimeDemand + safetyStock, supplier.minimumOrder)

  // Round up to nearest 5 for easier handling
  optimalQuantity = Math.ceil(optimalQuantity / 5) * 5

  return {
    optimalQuantity,
    safetyStock: Math.round(safetyStock),
    leadTimeDemand: Math.round(leadTimeDemand),
    totalCost: optimalQuantity * item.cost,
    estimatedDelivery: new Date(Date.now() + supplier.leadTimeDays * 24 * 60 * 60 * 1000).toISOString(),
  }
}

export async function POST(request: Request) {
  try {
    const { productId, urgency = "normal", reason = "Manual reorder" } = await request.json()

    // Find the product
    const product = inventoryItems.find((item) => item.id === productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Find the supplier
    const supplier = suppliers.find((s) => s.id === product.supplierId)
    if (!supplier) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 })
    }

    // Calculate optimal order quantity
    const orderCalculation = calculateOptimalOrderQuantity(product, supplier)

    // Generate purchase order
    const orderId = `PO-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    const purchaseOrder = {
      orderId,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      supplier: {
        id: supplier.id,
        name: supplier.name,
        contactEmail: supplier.contactEmail,
        reliability: supplier.reliability,
      },
      quantity: orderCalculation.optimalQuantity,
      unitCost: product.cost,
      totalCost: orderCalculation.totalCost,
      urgency,
      reason,
      status: urgency === "critical" ? "expedited" : "pending",
      orderDate: new Date().toISOString(),
      estimatedDelivery: orderCalculation.estimatedDelivery,
      leadTimeDays: supplier.leadTimeDays,
      currentStock: product.currentStock,
      targetStock: product.maxStock,
      safetyStock: orderCalculation.safetyStock,
      leadTimeDemand: orderCalculation.leadTimeDemand,
      approvalRequired: orderCalculation.totalCost > 500000, // Require approval for orders > ₹5,00,000
      mlRecommendation: {
        confidence: 0.91,
        factors: [
          "Current stock below reorder point",
          "7-day demand forecast considered",
          "Lead time and safety stock calculated",
          "Supplier reliability factored in",
        ],
        riskAssessment: urgency === "critical" ? "high" : "medium",
      },
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real system, this would:
    // 1. Create the PO in the database
    // 2. Send email to supplier
    // 3. Update inventory status
    // 4. Create tracking record

    return NextResponse.json({
      success: true,
      message: `Purchase order ${orderId} created successfully`,
      orderId,
      quantity: orderCalculation.optimalQuantity,
      totalCost: orderCalculation.totalCost,
      estimatedDelivery: orderCalculation.estimatedDelivery,
      purchaseOrder,
      nextSteps: [
        purchaseOrder.approvalRequired ? "Awaiting management approval" : "Order sent to supplier",
        "Supplier confirmation expected within 24 hours",
        `Delivery expected by ${new Date(orderCalculation.estimatedDelivery).toLocaleDateString()}`,
        "Inventory will be updated upon receipt",
      ],
    })
  } catch (error) {
    console.error("Replenishment error:", error)
    return NextResponse.json({ error: "Failed to create purchase order" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return recent replenishment activities
    const recentOrders = [
      {
        orderId: "PO-20240115-ABC123",
        productName: "iPhone 15 Pro",
        quantity: 45,
        status: "In Transit",
        estimatedDelivery: "2024-01-22T10:00:00Z",
        supplier: "Apple Inc.",
      },
      {
        orderId: "PO-20240114-DEF456",
        productName: "Nike Air Max 270",
        quantity: 30,
        status: "Delivered",
        deliveredAt: "2024-01-15T14:30:00Z",
        supplier: "Nike Inc.",
      },
      {
        orderId: "PO-20240113-GHI789",
        productName: "Samsung QLED TV",
        quantity: 15,
        status: "Pending Approval",
        totalCost: 1275000, // ₹12,75,000
        supplier: "Samsung Electronics",
      },
    ]

    return NextResponse.json({
      recentOrders,
      systemStatus: "Active",
      pendingApprovals: 1,
      totalOrdersThisMonth: 23,
      averageLeadTime: 5.2,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch replenishment data" }, { status: 500 })
  }
}
