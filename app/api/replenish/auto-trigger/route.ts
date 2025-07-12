import { NextResponse } from "next/server"

function generatePONumber() {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `PO-${timestamp}-${random}`
}

function calculateReplenishmentQuantity(productName: string, action: string) {
  // Simple logic to determine quantity based on product and urgency
  if (action.includes("Critical") || action.includes("Express")) {
    if (productName.includes("iPhone")) return 50
    if (productName.includes("Nike")) return 30
    return 25
  } else if (action.includes("Urgent")) {
    if (productName.includes("TV")) return 15
    return 20
  } else {
    return 10
  }
}

export async function POST(request: Request) {
  try {
    const { productId, productName, action } = await request.json()

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const poNumber = generatePONumber()
    const quantity = calculateReplenishmentQuantity(productName, action)

    // Determine supplier and delivery time based on urgency
    let supplier = "Standard Supplier"
    let estimatedDelivery = "5-7 business days"
    let cost = quantity * 50 // Base cost per unit

    if (action.includes("Critical") || action.includes("Express")) {
      supplier = "Express Supplier"
      estimatedDelivery = "1-2 business days"
      cost *= 1.5 // Express delivery premium
    } else if (action.includes("Urgent")) {
      supplier = "Priority Supplier"
      estimatedDelivery = "2-3 business days"
      cost *= 1.2 // Priority delivery premium
    }

    const response = {
      success: true,
      poNumber,
      productId,
      productName,
      action: action.split(" - ")[0], // Extract main action
      quantity,
      supplier,
      estimatedDelivery,
      totalCost: cost,
      status: "Pending Approval",
      createdAt: new Date().toISOString(),
      approvalRequired: cost > 5000, // Require approval for high-value orders
      notifications: {
        supplierNotified: true,
        managerNotified: cost > 5000,
        emailSent: true,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error triggering replenishment:", error)
    return NextResponse.json({ error: "Failed to trigger replenishment" }, { status: 500 })
  }
}
