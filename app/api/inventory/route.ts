import { NextResponse } from "next/server"

const mockInventoryData = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    sku: "APPL-IP15P-128",
    category: "Electronics",
    currentStock: 5,
    optimalStock: 50,
    reorderPoint: 10,
    price: 999.99,
    status: "critical",
    lastUpdated: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: 'Samsung 55" QLED TV',
    sku: "SAMS-Q55-2024",
    category: "Electronics",
    currentStock: 25,
    optimalStock: 30,
    reorderPoint: 8,
    price: 1299.99,
    status: "healthy",
    lastUpdated: "2024-01-15T09:15:00Z",
  },
  // Add more items as needed
]

export async function GET() {
  return NextResponse.json(mockInventoryData)
}

export async function POST(request: Request) {
  const data = await request.json()

  // In a real app, save to database
  const newItem = {
    id: Date.now().toString(),
    ...data,
    lastUpdated: new Date().toISOString(),
  }

  return NextResponse.json(newItem, { status: 201 })
}
