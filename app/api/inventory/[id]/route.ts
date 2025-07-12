import { NextResponse } from "next/server"

// Mock inventory data (shared with main route)
const mockInventory = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    sku: "APPL-IP15P-128",
    category: "Electronics",
    current_stock: 25,
    max_stock: 100,
    reorder_point: 20,
    price: 79999,
    warehouse_id: "550e8400-e29b-41d4-a716-446655440001",
    warehouse_name: "Main Distribution Center",
    demand_forecast_7_days: [5, 6, 4, 7, 5, 8, 6],
    avg_daily_sales: 5.8,
    lead_time_days: 7,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24",
    sku: "SAMS-GS24-256",
    category: "Electronics",
    current_stock: 45,
    max_stock: 80,
    reorder_point: 15,
    price: 69999,
    warehouse_id: "550e8400-e29b-41d4-a716-446655440002",
    warehouse_name: "West Coast Hub",
    demand_forecast_7_days: [3, 4, 5, 3, 4, 6, 5],
    avg_daily_sales: 4.3,
    lead_time_days: 5,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "3",
    name: "MacBook Air M3",
    sku: "APPL-MBA-M3-512",
    category: "Electronics",
    current_stock: 8,
    max_stock: 30,
    reorder_point: 10,
    price: 114999,
    warehouse_id: "550e8400-e29b-41d4-a716-446655440001",
    warehouse_name: "Main Distribution Center",
    demand_forecast_7_days: [2, 3, 2, 4, 3, 3, 2],
    avg_daily_sales: 2.7,
    lead_time_days: 10,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "4",
    name: "Sony WH-1000XM5",
    sku: "SONY-WH1000XM5",
    category: "Electronics",
    current_stock: 120,
    max_stock: 100,
    reorder_point: 25,
    price: 24999,
    warehouse_id: "550e8400-e29b-41d4-a716-446655440003",
    warehouse_name: "East Coast Facility",
    demand_forecast_7_days: [8, 9, 7, 10, 8, 12, 9],
    avg_daily_sales: 9.0,
    lead_time_days: 3,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "5",
    name: "Nike Air Max 270",
    sku: "NIKE-AM270-BLK-10",
    category: "Footwear",
    current_stock: 0,
    max_stock: 60,
    reorder_point: 15,
    price: 12999,
    warehouse_id: "550e8400-e29b-41d4-a716-446655440004",
    warehouse_name: "Midwest Center",
    demand_forecast_7_days: [4, 5, 3, 6, 4, 7, 5],
    avg_daily_sales: 4.9,
    lead_time_days: 5,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "6",
    name: "Levi's 501 Jeans",
    sku: "LEVI-501-32-BLU",
    category: "Clothing",
    current_stock: 85,
    max_stock: 100,
    reorder_point: 20,
    price: 4999,
    warehouse_id: "550e8400-e29b-41d4-a716-446655440002",
    warehouse_name: "West Coast Hub",
    demand_forecast_7_days: [6, 7, 5, 8, 6, 9, 7],
    avg_daily_sales: 6.9,
    lead_time_days: 4,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
]

function getWarehouseName(warehouseId: string): string {
  const warehouses: { [key: string]: string } = {
    "550e8400-e29b-41d4-a716-446655440001": "Main Distribution Center",
    "550e8400-e29b-41d4-a716-446655440002": "West Coast Hub",
    "550e8400-e29b-41d4-a716-446655440003": "East Coast Facility",
    "550e8400-e29b-41d4-a716-446655440004": "Midwest Center",
    "550e8400-e29b-41d4-a716-446655440005": "North Hub",
  }
  return warehouses[warehouseId] || "Unknown Warehouse"
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const item = mockInventory.find((item) => item.id === id)

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const itemIndex = mockInventory.findIndex((item) => item.id === id)

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Update the item
    mockInventory[itemIndex] = {
      ...mockInventory[itemIndex],
      ...body,
      warehouse_name: getWarehouseName(body.warehouse_id || mockInventory[itemIndex].warehouse_id),
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(mockInventory[itemIndex])
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const itemIndex = mockInventory.findIndex((item) => item.id === id)

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Remove the item
    mockInventory.splice(itemIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
