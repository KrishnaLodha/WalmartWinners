import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const region = searchParams.get("region") || "all"
  const store = searchParams.get("store") || "all"

  // Mock local events data
  const eventsData = {
    Mumbai: [
      {
        id: "1",
        name: "Gudi Padwa Festival",
        type: "festival",
        date: "2024-01-15",
        impact: "high",
        categories: ["Electronics", "Clothing", "Home"],
        expectedUplift: "25-40%",
      },
      {
        id: "2",
        name: "Weekend Sale",
        type: "promotion",
        date: "2024-01-15",
        impact: "medium",
        categories: ["All"],
        expectedUplift: "15-25%",
      },
    ],
    Delhi: [
      {
        id: "3",
        name: "Republic Day Preparation",
        type: "national_holiday",
        date: "2024-01-26",
        impact: "medium",
        categories: ["Electronics", "Clothing"],
        expectedUplift: "20-30%",
      },
    ],
    Bangalore: [
      {
        id: "4",
        name: "Tech Expo",
        type: "exhibition",
        date: "2024-01-16",
        impact: "high",
        categories: ["Electronics"],
        expectedUplift: "30-50%",
      },
      {
        id: "5",
        name: "Cricket Match - India vs Australia",
        type: "sports",
        date: "2024-01-17",
        impact: "medium",
        categories: ["Electronics", "Sports"],
        expectedUplift: "20-35%",
      },
    ],
    Chennai: [
      {
        id: "6",
        name: "Sports Festival",
        type: "sports",
        date: "2024-01-15",
        impact: "high",
        categories: ["Footwear", "Sports"],
        expectedUplift: "40-60%",
      },
      {
        id: "7",
        name: "Marathon Event",
        type: "sports",
        date: "2024-01-16",
        impact: "medium",
        categories: ["Footwear", "Sports"],
        expectedUplift: "25-40%",
      },
    ],
    Pune: [
      {
        id: "8",
        name: "Music Festival",
        type: "entertainment",
        date: "2024-01-18",
        impact: "medium",
        categories: ["Electronics", "Fashion"],
        expectedUplift: "15-30%",
      },
    ],
  }

  // Filter events based on region/store
  let filteredEvents: any[] = []
  if (region === "all") {
    filteredEvents = Object.values(eventsData).flat()
  } else {
    filteredEvents = eventsData[region as keyof typeof eventsData] || []
  }

  // Add weather data
  const weatherData = {
    Mumbai: { condition: "Clear", temperature: "28°C", impact: "Positive - High footfall expected" },
    Delhi: { condition: "Partly Cloudy", temperature: "22°C", impact: "Neutral - Normal footfall" },
    Bangalore: { condition: "Light Rain", temperature: "24°C", impact: "Negative - Reduced outdoor activities" },
    Chennai: { condition: "Sunny", temperature: "32°C", impact: "Positive - Good for sports activities" },
    Pune: { condition: "Clear", temperature: "26°C", impact: "Positive - Ideal weather conditions" },
  }

  const response = {
    region,
    store,
    date: new Date().toISOString().split("T")[0],
    events: filteredEvents,
    weather: region !== "all" ? weatherData[region as keyof typeof weatherData] : null,
    totalEvents: filteredEvents.length,
    highImpactEvents: filteredEvents.filter((e) => e.impact === "high").length,
  }

  return NextResponse.json(response)
}
