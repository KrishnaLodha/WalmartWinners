import { NextResponse } from "next/server"

// Customer segmentation and targeting logic
function getTargetedCustomers(productId: string, productName: string) {
  // Mock customer targeting based on product category and purchase history
  const mockCustomers = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0101",
      segment: "high_value",
      interests: ["Clothing", "Electronics"],
      lastPurchase: "2024-01-10",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1-555-0102",
      segment: "frequent_buyer",
      interests: ["Clothing", "Beauty"],
      lastPurchase: "2024-01-12",
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike.w@email.com",
      phone: "+1-555-0103",
      segment: "regular",
      interests: ["Electronics", "Sports"],
      lastPurchase: "2024-01-08",
    },
  ]

  // Filter customers based on product category and interests
  const targetedCustomers = mockCustomers.filter((customer) => {
    if (productName.toLowerCase().includes("jacket") || productName.toLowerCase().includes("dress")) {
      return customer.interests.includes("Clothing")
    }
    if (productName.toLowerCase().includes("headphones") || productName.toLowerCase().includes("iphone")) {
      return customer.interests.includes("Electronics")
    }
    return true
  })

  return targetedCustomers
}

function generateCouponCode(productName: string) {
  const productCode = productName
    .split(" ")
    .map((word) => word.substring(0, 2).toUpperCase())
    .join("")
  const randomNum = Math.floor(Math.random() * 100)
  return `WALMART${randomNum}-${productCode}`
}

function createPersonalizedMessage(customerName: string, productName: string, discount: number, couponCode: string) {
  const messages = [
    `Hi ${customerName}! We noticed you love great deals. Enjoy ${discount}% off on ${productName}! Use code ${couponCode} before it expires. Shop now!`,
    `${customerName}, exclusive offer just for you! Get ${discount}% off ${productName} with code ${couponCode}. Limited time only!`,
    `Hey ${customerName}! Special discount on ${productName} - ${discount}% off with code ${couponCode}. Don't miss out!`,
  ]

  return messages[Math.floor(Math.random() * messages.length)]
}

export async function POST(request: Request) {
  try {
    const { productId, productName } = await request.json()

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Get targeted customers
    const targetedCustomers = getTargetedCustomers(productId, productName)

    // Generate personalized coupons
    const coupons = targetedCustomers.map((customer) => {
      const couponCode = generateCouponCode(productName)
      const discount = Math.floor(Math.random() * 10) + 15 // 15-25% discount
      const message = createPersonalizedMessage(customer.name, productName, discount, couponCode)

      return {
        customerId: customer.id,
        customerName: customer.name,
        email: customer.email,
        phone: customer.phone,
        couponCode,
        discount,
        message,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        status: "sent",
      }
    })

    // Simulate sending SMS/Email
    console.log("Sending personalized coupons:", coupons)

    // Mock response
    const response = {
      success: true,
      couponsSent: coupons.length,
      targetedCustomers: targetedCustomers.length,
      coupons: coupons,
      estimatedConversionRate: "15-20%",
      expectedRevenue: Math.floor(Math.random() * 5000) + 2000,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error sending coupons:", error)
    return NextResponse.json({ error: "Failed to send coupons" }, { status: 500 })
  }
}
