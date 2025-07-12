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
  Send,
  Edit,
  DollarSign,
  Target,
  Zap,
  Users,
  BarChart3,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface SalesProduct {
  id: string
  name: string
  sku: string
  category: string
  currentStock: number
  expectedDemandNextWeek: number
  overstockPercentage: number
  originalPrice: number
  dynamicPrice: number
  suggestedDiscount: number
  promoStatus: "none" | "active" | "sent" | "expired"
  salesVelocity: number
  lastSaleDate: string
  couponsSent: number
  conversionRate: number
}

const mockSalesData: SalesProduct[] = [
  {
    id: "1",
    name: "Winter Jacket - XL",
    sku: "CLTH-WJ-XL-BLU",
    category: "Clothing",
    currentStock: 85,
    expectedDemandNextWeek: 35,
    overstockPercentage: 243,
    originalPrice: 7199, // ₹7,199
    dynamicPrice: 5759, // ₹5,759
    suggestedDiscount: 20,
    promoStatus: "active",
    salesVelocity: 2.1,
    lastSaleDate: "2024-01-14",
    couponsSent: 45,
    conversionRate: 12.5,
  },
  {
    id: "2",
    name: "Summer Dress - M",
    sku: "CLTH-SD-M-RED",
    category: "Clothing",
    currentStock: 120,
    expectedDemandNextWeek: 80,
    overstockPercentage: 150,
    originalPrice: 3999, // ₹3,999
    dynamicPrice: 3199, // ₹3,199
    suggestedDiscount: 20,
    promoStatus: "sent",
    salesVelocity: 5.2,
    lastSaleDate: "2024-01-15",
    couponsSent: 28,
    conversionRate: 18.7,
  },
  {
    id: "3",
    name: "iPhone 15 Pro",
    sku: "APPL-IP15P-128",
    category: "Electronics",
    currentStock: 5,
    expectedDemandNextWeek: 45,
    overstockPercentage: 11,
    originalPrice: 134999, // ₹1,34,999
    dynamicPrice: 134999, // ₹1,34,999
    suggestedDiscount: 0,
    promoStatus: "none",
    salesVelocity: 8.9,
    lastSaleDate: "2024-01-15",
    couponsSent: 0,
    conversionRate: 0,
  },
  {
    id: "4",
    name: "Bluetooth Headphones",
    sku: "ELEC-BH-WH-001",
    category: "Electronics",
    currentStock: 60,
    expectedDemandNextWeek: 40,
    overstockPercentage: 150,
    originalPrice: 15999, // ₹15,999
    dynamicPrice: 12799, // ₹12,799
    suggestedDiscount: 20,
    promoStatus: "active",
    salesVelocity: 3.4,
    lastSaleDate: "2024-01-13",
    couponsSent: 32,
    conversionRate: 15.6,
  },
  {
    id: "5",
    name: "Running Shoes - Size 10",
    sku: "SHOE-RS-10-BLK",
    category: "Footwear",
    currentStock: 25,
    expectedDemandNextWeek: 30,
    overstockPercentage: 83,
    originalPrice: 10399, // ₹10,399
    dynamicPrice: 10399, // ₹10,399
    suggestedDiscount: 0,
    promoStatus: "none",
    salesVelocity: 6.1,
    lastSaleDate: "2024-01-15",
    couponsSent: 0,
    conversionRate: 0,
  },
]

const salesTrendData = [
  { date: "Jan 8", sales: 336000, forecast: 320000, dynamic: 304000 },
  { date: "Jan 9", sales: 248000, forecast: 240000, dynamic: 256000 },
  { date: "Jan 10", sales: 224000, forecast: 200000, dynamic: 232000 },
  { date: "Jan 11", sales: 256000, forecast: 224000, dynamic: 248000 },
  { date: "Jan 12", sales: 232000, forecast: 248000, dynamic: 240000 },
  { date: "Jan 13", sales: 304000, forecast: 280000, dynamic: 312000 },
  { date: "Jan 14", sales: 328000, forecast: 304000, dynamic: 336000 },
]

const categoryPerformance = [
  { category: "Electronics", revenue: 3600000, growth: 12.5 },
  { category: "Clothing", revenue: 2560000, growth: -5.2 },
  { category: "Footwear", revenue: 1440000, growth: 8.1 },
  { category: "Home", revenue: 2000000, growth: 15.3 },
]

export default function SalesAnalyticsPage() {
  const [products, setProducts] = useState<SalesProduct[]>(mockSalesData)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [promoFilter, setPromoFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<SalesProduct>>({})

  const handleEditProduct = (product: SalesProduct) => {
    setEditingProduct(product.id)
    setEditForm({
      name: product.name,
      currentStock: product.currentStock,
      originalPrice: product.originalPrice,
      dynamicPrice: product.dynamicPrice,
      suggestedDiscount: product.suggestedDiscount,
    })
  }

  const handleSaveEdit = () => {
    if (!editingProduct) return

    setProducts((prev) =>
      prev.map((product) =>
        product.id === editingProduct
          ? {
              ...product,
              ...editForm,
              // Recalculate overstock percentage if stock changed
              overstockPercentage: editForm.currentStock
                ? Math.round((editForm.currentStock / product.expectedDemandNextWeek) * 100)
                : product.overstockPercentage,
            }
          : product,
      ),
    )

    setEditingProduct(null)
    setEditForm({})

    toast({
      title: "Product Updated",
      description: "Product information has been updated successfully.",
    })
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setEditForm({})
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesPromo = promoFilter === "all" || product.promoStatus === promoFilter

    return matchesSearch && matchesCategory && matchesPromo
  })

  const getOverstockBadge = (percentage: number) => {
    if (percentage > 200) {
      return <Badge variant="destructive">Critical Overstock</Badge>
    } else if (percentage > 120) {
      return <Badge className="bg-amber-100 text-amber-800">Overstock</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800">Healthy</Badge>
    }
  }

  const getPromoStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active Promo</Badge>
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800">Coupon Sent</Badge>
      case "expired":
        return <Badge variant="secondary">Expired</Badge>
      default:
        return <Badge variant="outline">No Promo</Badge>
    }
  }

  const handleSendCoupon = async (productId: string, productName: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/promo/send-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, productName }),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Coupon Sent Successfully!",
          description: `${result.couponsSent} personalized coupons sent to targeted customers.`,
        })

        // Update product status
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, promoStatus: "sent" as const, couponsSent: p.couponsSent + result.couponsSent }
              : p,
          ),
        )
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send coupons. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePricing = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/sales-analytics/update-pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: products }),
      })

      if (response.ok) {
        const updatedProducts = await response.json()
        setProducts(updatedProducts)
        toast({
          title: "Pricing Updated!",
          description: `AI-powered dynamic pricing applied to ${updatedProducts.filter((p) => p.suggestedDiscount > 0).length} products.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update pricing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const overstockedItems = products.filter((p) => p.overstockPercentage > 120).length
  const activePromos = products.filter((p) => p.promoStatus === "active").length
  const totalRevenue = products.reduce((sum, p) => sum + p.dynamicPrice * (100 - p.currentStock), 0)
  const avgConversionRate = products.reduce((sum, p) => sum + p.conversionRate, 0) / products.length

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Sales Analytics</h1>
              <p className="text-muted-foreground">AI-powered sales optimization and dynamic pricing</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleUpdatePricing} disabled={isLoading}>
                <Zap className="h-4 w-4 mr-2" />
                Update AI Pricing
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5% from last week
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overstocked Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{overstockedItems}</div>
                <p className="text-xs text-muted-foreground">Items requiring price optimization</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
                <Target className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{activePromos}</div>
                <p className="text-xs text-muted-foreground">Running promotional campaigns</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Conversion Rate</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{avgConversionRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">From promotional campaigns</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance Trend</CardTitle>
                <CardDescription>Actual vs Forecast vs Dynamic Pricing Impact</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#0071ce" name="Actual Sales" strokeWidth={2} />
                    <Line type="monotone" dataKey="forecast" stroke="#ffc220" name="Forecast" strokeWidth={2} />
                    <Line type="monotone" dataKey="dynamic" stroke="#00a651" name="Dynamic Pricing" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Revenue and growth by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#0071ce" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Product Sales Analytics
              </CardTitle>
              <CardDescription>AI-powered pricing optimization and promotion management</CardDescription>
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
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Footwear">Footwear</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={promoFilter} onValueChange={setPromoFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Promotion Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active Promo</SelectItem>
                    <SelectItem value="sent">Coupon Sent</SelectItem>
                    <SelectItem value="none">No Promo</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
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
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Overstock %</TableHead>
                      <TableHead>Dynamic Price</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Promo Status</TableHead>
                      <TableHead>Conversion</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {editingProduct === product.id ? (
                            <Input
                              value={editForm.name || ""}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                              className="w-full"
                            />
                          ) : (
                            product.name
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          {editingProduct === product.id ? (
                            <Input
                              type="number"
                              value={editForm.currentStock || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({ ...prev, currentStock: Number.parseInt(e.target.value) || 0 }))
                              }
                              className="w-20"
                            />
                          ) : (
                            product.currentStock
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={product.overstockPercentage > 120 ? "text-amber-600 font-medium" : ""}>
                              {editingProduct === product.id && editForm.currentStock
                                ? Math.round((editForm.currentStock / product.expectedDemandNextWeek) * 100)
                                : product.overstockPercentage}
                              %
                            </span>
                            {getOverstockBadge(
                              editingProduct === product.id && editForm.currentStock
                                ? Math.round((editForm.currentStock / product.expectedDemandNextWeek) * 100)
                                : product.overstockPercentage,
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            {editingProduct === product.id ? (
                              <Input
                                type="number"
                                step="0.01"
                                value={editForm.dynamicPrice || ""}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    dynamicPrice: Number.parseFloat(e.target.value) || 0,
                                  }))
                                }
                                className="w-24"
                              />
                            ) : (
                              <>
                                <span className="font-medium">₹{product.dynamicPrice.toLocaleString()}</span>
                                {product.dynamicPrice < product.originalPrice && (
                                  <span className="text-xs text-muted-foreground line-through">
                                    ₹{product.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {editingProduct === product.id ? (
                            <Input
                              type="number"
                              value={editForm.suggestedDiscount || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  suggestedDiscount: Number.parseInt(e.target.value) || 0,
                                }))
                              }
                              className="w-16"
                              placeholder="%"
                            />
                          ) : product.suggestedDiscount > 0 ? (
                            <Badge className="bg-green-100 text-green-800">{product.suggestedDiscount}% OFF</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{getPromoStatusBadge(product.promoStatus)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{product.conversionRate}%</span>
                            <span className="text-xs text-muted-foreground">{product.couponsSent} sent</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {editingProduct === product.id ? (
                              <>
                                <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                {product.overstockPercentage > 120 && product.promoStatus === "none" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleSendCoupon(product.id, product.name)}
                                    disabled={isLoading}
                                    className="bg-walmart-blue hover:bg-walmart-dark-blue"
                                  >
                                    <Send className="h-3 w-3 mr-1" />
                                    Send Coupon
                                  </Button>
                                )}
                                <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              </>
                            )}
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
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-semibold">Dynamic Pricing Recommendations</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      Winter Jacket: Reduce price by 20% to clear overstock
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      Bluetooth Headphones: Current discount is optimal
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Summer Dress: Increase promotion to boost conversion
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">Customer Targeting Insights</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      245 customers interested in winter clothing
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      Best time to send coupons: Tuesday 2-4 PM
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                      SMS campaigns show 23% higher conversion
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
