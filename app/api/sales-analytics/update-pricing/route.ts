import { NextResponse } from "next/server"

// AI-powered dynamic pricing logic
function calculateDynamicPrice(product: any) {
  const { originalPrice, overstockPercentage, category, salesVelocity } = product

  let discountPercentage = 0

  // More aggressive base discount based on overstock level
  if (overstockPercentage > 200) {
    discountPercentage = 30 // Very aggressive discount for critical overstock
  } else if (overstockPercentage > 150) {
    discountPercentage = 25 // Strong discount
  } else if (overstockPercentage > 120) {
    discountPercentage = 20 // Moderate discount
  } else if (overstockPercentage > 100) {
    discountPercentage = 10 // Light discount
  }

  // Adjust based on category
  const categoryMultipliers: { [key: string]: number } = {
    Electronics: 0.7, // Electronics are less price-sensitive
    Clothing: 1.3, // Clothing responds very well to discounts
    Footwear: 1.1, // Good response
    Home: 1.2, // Good response
  }

  discountPercentage *= categoryMultipliers[category] || 1.0

  // Adjust based on sales velocity (lower velocity = higher discount)
  if (salesVelocity < 2) {
    discountPercentage *= 1.5 // Much higher discount for slow-moving items
  } else if (salesVelocity < 4) {
    discountPercentage *= 1.2
  }

  // Cap discount at 40% and ensure minimum discount for overstocked items
  discountPercentage = Math.min(discountPercentage, 40)

  // Ensure minimum discount for overstocked items
  if (overstockPercentage > 120 && discountPercentage < 15) {
    discountPercentage = 15
  }

  discountPercentage = Math.round(discountPercentage)

  const dynamicPrice = originalPrice * (1 - discountPercentage / 100)

  return {
    dynamicPrice: Math.round(dynamicPrice * 100) / 100,
    suggestedDiscount: discountPercentage,
  }
}

export async function POST(request: Request) {
  try {
    const { products } = await request.json()

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Apply AI-powered dynamic pricing to all products
    const updatedProducts = products.map((product: any) => {
      const pricing = calculateDynamicPrice(product)
      return {
        ...product,
        dynamicPrice: pricing.dynamicPrice,
        suggestedDiscount: pricing.suggestedDiscount,
      }
    })

    return NextResponse.json(updatedProducts)
  } catch (error) {
    console.error("Error updating pricing:", error)
    return NextResponse.json({ error: "Failed to update pricing" }, { status: 500 })
  }
}
