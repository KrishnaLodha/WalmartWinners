import { NextResponse } from "next/server"

export async function GET() {
  const forecastData = {
    demandForecast: [
      { date: "2024-01-16", predicted: 4500, confidence: 0.85 },
      { date: "2024-01-17", predicted: 3200, confidence: 0.82 },
      { date: "2024-01-18", predicted: 2800, confidence: 0.78 },
      { date: "2024-01-19", predicted: 3100, confidence: 0.8 },
      { date: "2024-01-20", predicted: 2900, confidence: 0.83 },
      { date: "2024-01-21", predicted: 3800, confidence: 0.87 },
      { date: "2024-01-22", predicted: 4200, confidence: 0.89 },
    ],
    productForecasts: [
      {
        productId: "1",
        name: "iPhone 15 Pro",
        currentStock: 5,
        predictedDemand: 45,
        recommendedOrder: 40,
        confidence: 0.92,
      },
      {
        productId: "2",
        name: "Samsung TV",
        currentStock: 25,
        predictedDemand: 12,
        recommendedOrder: 0,
        confidence: 0.88,
      },
    ],
    insights: [
      {
        type: "seasonal_trend",
        message: "Electronics demand expected to increase by 15% next week",
        impact: "high",
      },
      {
        type: "weather_impact",
        message: "Cold weather forecast may boost winter clothing sales",
        impact: "medium",
      },
    ],
  }

  return NextResponse.json(forecastData)
}
