import { NextResponse } from "next/server"

// AI-powered demand forecasting logic
function calculateDemandForecast(product: any) {
  const { currentStock, dailySalesRate, category, seasonality, events, weather } = product

  // Base forecast using historical sales rate
  let baseDemand = dailySalesRate

  // Apply seasonality factors
  const seasonalityMultipliers: { [key: string]: number } = {
    Electronics: 1.1, // Consistent demand
    Clothing: 0.8, // End of season
    Footwear: 1.2, // Sports season
    Home: 1.0, // Stable
  }

  baseDemand *= seasonalityMultipliers[category] || 1.0

  // Apply event impact
  if (events.includes("festival")) {
    baseDemand *= 1.3
  }
  if (events.includes("sports")) {
    baseDemand *= 1.2
  }
  if (events.includes("sale")) {
    baseDemand *= 1.5
  }

  // Apply weather impact
  if (weather === "good") {
    baseDemand *= 1.1
  } else if (weather === "bad") {
    baseDemand *= 0.9
  }

  // Generate 7-day forecast with some variation
  const forecast = []
  for (let i = 0; i < 7; i++) {
    const dayMultiplier = [1.0, 1.2, 0.8, 1.1, 1.3, 1.4, 0.9][i] // Weekly pattern
    const randomVariation = 0.8 + Math.random() * 0.4 // ±20% variation
    const dailyDemand = Math.round(baseDemand * dayMultiplier * randomVariation)
    forecast.push(Math.max(0, dailyDemand))
  }

  const totalForecastedDemand = forecast.reduce((sum, demand) => sum + demand, 0)
  const daysRemaining = currentStock / (totalForecastedDemand / 7)

  // Determine risk status
  let riskStatus = "healthy"
  if (daysRemaining < 7) {
    riskStatus = "out_of_stock"
  } else if (daysRemaining > 30 && totalForecastedDemand < currentStock * 0.3) {
    riskStatus = "overstock"
  }

  return {
    forecastedDemand7Days: forecast,
    totalForecastedDemand,
    daysRemaining,
    riskStatus,
    confidence: 0.85 + Math.random() * 0.1, // 85-95% confidence
  }
}

const mockProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    sku: "APPL-IP15P-128",
    store: "Mumbai Central",
    category: "Electronics",
    currentStock: 5,
    dailySalesRate: 3.2,
    seasonality: "high",
    events: ["festival", "sale"],
    weather: "good",
  },
  {
    id: "2",
    name: "Winter Jacket - XL",
    sku: "CLTH-WJ-XL-BLU",
    store: "Delhi NCR",
    category: "Clothing",
    currentStock: 85,
    dailySalesRate: 1.8,
    seasonality: "low",
    events: [],
    weather: "warming",
  },
  {
    id: "3",
    name: 'Samsung 55" QLED TV',
    sku: "SAMS-Q55-2024",
    store: "Bangalore",
    category: "Electronics",
    currentStock: 25,
    dailySalesRate: 2.1,
    seasonality: "medium",
    events: ["sports"],
    weather: "good",
  },
  {
    id: "4",
    name: "Nike Air Max 270",
    sku: "NIKE-AM270-BLK",
    store: "Chennai",
    category: "Footwear",
    currentStock: 3,
    dailySalesRate: 2.8,
    seasonality: "high",
    events: ["sports"],
    weather: "good",
  },
  {
    id: "5",
    name: "Bluetooth Headphones",
    sku: "ELEC-BH-WH-001",
    store: "Pune",
    category: "Electronics",
    currentStock: 18,
    dailySalesRate: 1.5,
    seasonality: "medium",
    events: ["festival"],
    weather: "neutral",
  },
]

export async function GET() {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const forecastData = mockProducts.map((product) => {
    const forecast = calculateDemandForecast(product)

    // Generate replenishment action based on risk
    let replenishmentAction = "Monitor - Standard reorder"
    if (forecast.riskStatus === "out_of_stock") {
      if (forecast.daysRemaining < 2) {
        replenishmentAction = "Critical - Express delivery needed"
      } else {
        replenishmentAction = "Urgent Restock - 2-3 day delivery"
      }
    } else if (forecast.riskStatus === "overstock") {
      replenishmentAction = "Reduce orders - Promote clearance"
    }

    // Generate local events
    const localEvents = []
    if (product.events.includes("festival")) {
      localEvents.push("Gudi Padwa Festival", "Weekend Sale")
    }
    if (product.events.includes("sports")) {
      localEvents.push("Sports Festival", "Marathon Event")
    }
    if (product.category === "Clothing") {
      localEvents.push("End of Winter Season")
    }

    // Generate weather impact
    let weatherImpact = "Neutral impact"
    if (product.weather === "good") {
      weatherImpact = "Clear weather - High footfall"
    } else if (product.weather === "warming") {
      weatherImpact = "Warming trend - Reduced demand"
    }

    return {
      ...product,
      ...forecast,
      replenishmentAction,
      localEvents,
      weatherImpact,
      lastUpdated: new Date().toISOString(),
    }
  })

  return NextResponse.json(forecastData)
}
