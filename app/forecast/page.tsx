"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TopNavbar } from "@/components/top-navbar"
import { useToast } from "@/hooks/use-toast"
import {
  AlertTriangle,
  TrendingUp,
  Search,
  Download,
  Edit,
  ShoppingCart,
  Package,
  Calendar,
  Cloud,
  Target,
  Brain,
  Zap,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface ForecastProduct {
  id: string
  name: string
  sku: string
  store: string
  category: string
  currentStock: number
  dailySalesRate: number
  forecastedDemand7Days: number[]
  totalForecastedDemand: number
  daysRemaining: number
  riskStatus: "out_of_stock" | "overstock" | "healthy"
  replenishmentAction: string
  localEvents: string[]
  weatherImpact: string
  confidence: number
  lastUpdated: string
}

const mockForecastData: ForecastProduct[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    sku: "APPL-IP15P-128",
    store: "Mumbai Central",
    category: "Electronics",
    currentStock: 5,
    dailySalesRate: 3.2,
    forecastedDemand7Days: [4, 5, 6, 3, 2, 4, 5],
    totalForecastedDemand: 29,
    daysRemaining: 1.6,
    riskStatus: "out_of_stock",
    replenishmentAction: "Urgent Restock - 50 units",
    localEvents: ["Gudi Padwa Festival", "Weekend Sale"],
    weatherImpact: "Clear weather - High footfall",
    confidence: 0.92,
    lastUpdated: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Winter Jacket - XL",
    sku: "CLTH-WJ-XL-BLU",
    store: "Delhi NCR",
    category: "Clothing",
    currentStock: 85,
    dailySalesRate: 1.8,
    forecastedDemand7Days: [1, 2, 1, 0, 1, 2, 1],
    totalForecastedDemand: 8,
    daysRemaining: 47.2,
    riskStatus: "overstock",
    replenishmentAction: "Reduce orders - Promote clearance",
    localEvents: ["End of Winter Season"],
    weatherImpact: "Warming trend - Reduced demand",
    confidence: 0.88,
    lastUpdated: "2024-01-15T10:30:00Z",
  },
  {
    id: "3",
    name: 'Samsung 55" QLED TV',
    sku: "SAMS-Q55-2024",
    store: "Bangalore",
    category: "Electronics",
    currentStock: 25,
    dailySalesRate: 2.1,
    forecastedDemand7Days: [2, 3, 2, 1, 2, 3, 2],
    totalForecastedDemand: 15,
    daysRemaining: 11.9,
    riskStatus: "healthy",
    replenishmentAction: "Monitor - Reorder in 7 days",
    localEvents: ["Tech Expo", "Cricket Match"],
    weatherImpact: "Monsoon - Indoor activities boost",
    confidence: 0.85,
    lastUpdated: "2024-01-15T10:30:00Z",
  },
  {
    id: "4",
    name: "Nike Air Max 270",
    sku: "NIKE-AM270-BLK",
    store: "Chennai",
    category: "Footwear",
    currentStock: 3,
    dailySalesRate: 2.8,
    forecastedDemand7Days: [3, 4, 2, 3, 4, 3, 2],
    totalForecastedDemand: 21,
    daysRemaining: 1.1,
    riskStatus: "out_of_stock",
    replenishmentAction: "Critical - Express delivery 30 units",
    localEvents: ["Sports Festival", "Marathon Event"],
    weatherImpact: "Perfect weather - High activity",
    confidence: 0.94,
    lastUpdated: "2024-01-15T10:30:00Z",
  },
  {
    id: "5",
    name: "Bluetooth Headphones",
    sku: "ELEC-BH-WH-001",
    store: "Pune",
    category: "Electronics",
    currentStock: 18,
    dailySalesRate: 1.5,
    forecastedDemand7Days: [1, 2, 1, 2, 1, 2, 1],
    totalForecastedDemand: 10,
    daysRemaining: 12.0,
    riskStatus: "healthy",
    replenishmentAction: "Standard reorder - 20 units",
    localEvents: ["Music Festival"],
    weatherImpact: "Neutral impact",
    confidence: 0.81,
    lastUpdated: "2024-01-15T10:30:00Z",
  },
]

const forecastTrendData = [
  { date: "Jan 16", predicted: 45, actual: 42, confidence: 0.92 },
  { date: "Jan 17", predicted: 52, actual: 48, confidence: 0.89 },
  { date: "Jan 18", predicted: 38, actual: 41, confidence: 0.85 },
  { date: "Jan 19", predicted: 44, actual: 46, confidence: 0.91 },
  { date: "Jan 20", predicted: 49, actual: null, confidence: 0.88 },
  { date: "Jan 21", predicted: 55, actual: null, confidence: 0.86 },
  { date: "Jan 22", predicted: 41, actual: null, confidence: 0.83 },
]

const riskDistribution = [
  { status: "Healthy", count: 45, color: "#00a651" },
  { status: "Out of Stock", count: 12, color: "#e53e3e" },
  { status: "Overstock", count: 8, color: "#805ad5" },
]

export default function DemandForecastPage() {
  const [products, setProducts] = useState<ForecastProduct[]>(mockForecastData)
  const [searchTerm, setSearchTerm] = useState("")
  const [storeFilter, setStoreFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [isRetraining, setIsRetraining] = useState(false)
  const { toast } = useToast()

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStore = storeFilter === "all" || product.store === storeFilter
    const matchesRisk = riskFilter === "all" || product.riskStatus === riskFilter

    return matchesSearch && matchesStore && matchesRisk
  })

  const getRiskBadge = (status: string) => {
    switch (status) {
      case "out_of_stock":
        return <Badge variant="destructive">Out of Stock Risk</Badge>
      case "overstock":
        return <Badge className="bg-purple-100 text-purple-800">Overstock Risk</Badge>
      case "healthy":
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleTriggerPO = async (productId: string, productName: string, action: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/replenish/auto-trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, productName, action }),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Purchase Order Triggered!",
          description: `${result.action} - PO #${result.poNumber} created for ${result.quantity} units.`,
        })

        // Update product status
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, replenishmentAction: "PO Triggered - " + result.poNumber } : p,
          ),
        )
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to trigger purchase order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetrainModel = async () => {
    setIsRetraining(true)
    try {
      const response = await fetch("/api/forecast/retrain", {
        method: "POST",
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Model Retrained Successfully!",
          description: `Accuracy improved to ${result.newAccuracy}%. Forecasts updated with latest data.`,
        })

        // Refresh forecast data
        const updatedResponse = await fetch("/api/demand-forecast")
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json()
          setProducts(updatedData)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to retrain model. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRetraining(false)
    }
  }

  const outOfStockItems = products.filter((p) => p.riskStatus === "out_of_stock").length
  const overstockItems = products.filter((p) => p.riskStatus === "overstock").length
  const healthyItems = products.filter((p) => p.riskStatus === "healthy").length
  const avgConfidence = products.reduce((sum, p) => sum + p.confidence, 0) / products.length

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Demand Forecast</h1>
              <p className="text-muted-foreground">AI-powered inventory demand prediction and risk analysis</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleRetrainModel} disabled={isRetraining}>
                <Brain className="h-4 w-4 mr-2" />
                {isRetraining ? "Retraining..." : "Retrain AI Model"}
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Forecast
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock Risk</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
                <p className="text-xs text-muted-foreground">Products need immediate attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overstock Risk</CardTitle>
                <Package className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{overstockItems}</div>
                <p className="text-xs text-muted-foreground">Items with excess inventory</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Healthy Stock</CardTitle>
                <Target className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{healthyItems}</div>
                <p className="text-xs text-muted-foreground">Optimal inventory levels</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
                <Brain className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{(avgConfidence * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">AI prediction confidence</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>7-Day Demand Forecast Accuracy</CardTitle>
                <CardDescription>Predicted vs Actual demand with confidence intervals</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={forecastTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="predicted" stroke="#0071ce" name="Predicted" strokeWidth={2} />
                    <Line type="monotone" dataKey="actual" stroke="#00a651" name="Actual" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Status Distribution</CardTitle>
                <CardDescription>Current inventory risk across all products</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0071ce" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Forecast Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Demand Forecast Analysis
              </CardTitle>
              <CardDescription>AI-powered 7-day demand predictions with risk assessment</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by product name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={storeFilter} onValueChange={setStoreFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stores</SelectItem>
                    <SelectItem value="Mumbai Central">Mumbai Central</SelectItem>
                    <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Risk Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock Risk</SelectItem>
                    <SelectItem value="overstock">Overstock Risk</SelectItem>
                    <SelectItem value="healthy">Healthy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Daily Sales Rate</TableHead>
                      <TableHead>7-Day Forecast</TableHead>
                      <TableHead>Days Remaining</TableHead>
                      <TableHead>Risk Status</TableHead>
                      <TableHead>Local Events</TableHead>
                      <TableHead>Replenishment Action</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                        <TableCell>{product.store}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{product.currentStock}</span>
                            <span className="text-xs text-muted-foreground">units</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{product.dailySalesRate}</span>
                            <span className="text-xs text-muted-foreground">units/day</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {product.forecastedDemand7Days.map((demand, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 rounded text-xs flex items-center justify-center bg-blue-100 text-blue-800"
                              >
                                {demand}
                              </div>
                            ))}
                            <div className="ml-2 text-sm font-medium">Total: {product.totalForecastedDemand}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span
                              className={`font-medium ${
                                product.daysRemaining < 7
                                  ? "text-red-600"
                                  : product.daysRemaining > 30
                                    ? "text-purple-600"
                                    : "text-green-600"
                              }`}
                            >
                              {product.daysRemaining.toFixed(1)} days
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {product.confidence * 100}% confidence
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getRiskBadge(product.riskStatus)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {product.localEvents.map((event, index) => (
                              <div key={index} className="flex items-center gap-1 text-xs">
                                <Calendar className="h-3 w-3" />
                                {event}
                              </div>
                            ))}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Cloud className="h-3 w-3" />
                              {product.weatherImpact}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{product.replenishmentAction}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {(product.riskStatus === "out_of_stock" || product.riskStatus === "overstock") && (
                              <Button
                                size="sm"
                                onClick={() => handleTriggerPO(product.id, product.name, product.replenishmentAction)}
                                disabled={isLoading}
                                className="bg-walmart-blue hover:bg-walmart-dark-blue"
                              >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                Trigger PO
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="bg-gradient-to-r from-walmart-blue/5 to-walmart-yellow/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-walmart-blue" />
                AI Forecast Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-3">
                  <h3 className="font-semibold">Critical Actions Needed</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      iPhone 15 Pro: Stock out in 1.6 days - Urgent restock
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      Nike Air Max: Critical shortage in Chennai store
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      Winter Jacket: 47 days excess - Promote clearance
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">External Factors Impact</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      Gudi Padwa festival boosting electronics demand
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Sports events increasing footwear sales
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      Weather warming - Winter clothing declining
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">Model Performance</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Overall accuracy: 89.2% (↑2.1% this week)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      Electronics category: 94% accuracy
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                      Next retrain scheduled: Tomorrow 2 AM
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
