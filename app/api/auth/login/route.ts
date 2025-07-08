import { type NextRequest, NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "1",
    name: "John Admin",
    email: "admin@walmart.com",
    password: "admin123",
    role: "admin" as const,
  },
  {
    id: "2",
    name: "Jane Manager",
    email: "manager@walmart.com",
    password: "manager123",
    role: "store_manager" as const,
    storeId: "store-001",
  },
  {
    id: "3",
    name: "Bob Analyst",
    email: "analyst@walmart.com",
    password: "analyst123",
    role: "analyst" as const,
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token: "mock-jwt-token", // In real app, generate actual JWT
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
