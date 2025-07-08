"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, Package, ShoppingCart, AlertTriangle, DollarSign, Users, Zap } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"

const salesData = [
  { name: "Mon", sales: 4000, forecast: 4200 },
  { name: "Tue", sales: 3000, forecast: 3100 },
  { name: "Wed", sales: 2000, forecast: 2300 },
  { name: "Thu", sales: 2780, forecast: 2900 },
  { name: "Fri", sales: 1890, forecast: 2000 },
  { name: "Sat", sales: 2390, forecast: 2500 },
  { name: "Sun", sales: 3490, forecast: 3600 },
]

const categoryData = [
  { name: "Electronics", value: 35, color: "#0071ce" },
  { name: "Groceries", value: 25, color: "#ffc220" },
  { name: "Clothing", value: 20, color: "#00a651" },
  { name: "Home", value: 20, color: "#ff6900" },
]

const topProducts = [
  { name: "iPhone 15", sales: 1250, trend: "up", change: 12 },
  { name: 'Samsung TV 55"', sales: 890, trend: "up", change: 8 },
  { name: "Nike Air Max", sales: 750, trend: "down", change: -5 },
  { name: "MacBook Pro", sales: 650, trend: "up", change: 15 },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard")
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Here's what's happening at your store.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Store Online
          </Badge>
          <Button className="bg-walmart-blue hover:bg-walmart-dark-blue">
            <Zap className="h-4 w-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +20.1% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +180.1% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -19 from yesterday
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +201 since last hour
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Sales Overview */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales vs Forecast</CardTitle>
            <CardDescription>Daily sales performance compared to AI predictions</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#0071ce" name="Actual Sales" />
                <Bar dataKey="forecast" fill="#ffc220" name="Forecast" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing items this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-walmart-blue/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${product.trend === "up" ? "text-green-600" : "text-red-600"}`}
                    >
                      {product.change > 0 ? "+" : ""}
                      {product.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Active Alerts
            </CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Low Stock Alert</p>
                  <p className="text-xs text-red-600">iPhone 15 Pro - Only 5 units left</p>
                </div>
                <Badge variant="destructive" className="text-xs">
                  Critical
                </Badge>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">Overstock Warning</p>
                  <p className="text-xs text-amber-600">Winter Jackets - 150% above optimal level</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Medium
                </Badge>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">Promotion Opportunity</p>
                  <p className="text-xs text-blue-600">Summer items ready for clearance sale</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Info
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Health */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Health Overview</CardTitle>
          <CardDescription>Current stock levels across key categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Electronics</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground">Healthy stock levels</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Groceries</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2" />
              <p className="text-xs text-red-600">Needs restocking</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Clothing</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-amber-600">Overstock risk</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Home & Garden</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">Optimal levels</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
