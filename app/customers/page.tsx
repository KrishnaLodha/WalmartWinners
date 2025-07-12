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
import { Users, Search, Send, Target, TrendingUp, ShoppingCart, Mail, Phone, Star, Gift, Zap } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  avgOrderValue: number
  lastOrderDate: string
  preferredCategories: string[]
  overstockInterest: string[]
  loyaltyScore: number
  couponsSent: number
  conversionRate: number
  status: "vip" | "regular" | "new"
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    totalOrders: 24,
    totalSpent: 185000, // ₹1,85,000
    avgOrderValue: 7708, // ₹7,708
    lastOrderDate: "2024-01-14",
    preferredCategories: ["Electronics", "Clothing"],
    overstockInterest: ["Sony WH-1000XM5", "Winter Jacket - XL"],
    loyaltyScore: 92,
    couponsSent: 8,
    conversionRate: 75.0,
    status: "vip",
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 87654 32109",
    totalOrders: 18,
    totalSpent: 142000, // ₹1,42,000
    avgOrderValue: 7889, // ₹7,889
    lastOrderDate: "2024-01-13",
    preferredCategories: ["Clothing", "Footwear"],
    overstockInterest: ["Summer Dress - M", "Levi's 501 Jeans"],
    loyaltyScore: 88,
    couponsSent: 6,
    conversionRate: 83.3,
    status: "vip",
  },
  {
    id: "3",
    name: "Amit Patel",
    email: "amit.patel@email.com",
    phone: "+91 76543 21098",
    totalOrders: 12,
    totalSpent: 95000, // ₹95,000
    avgOrderValue: 7917, // ₹7,917
    lastOrderDate: "2024-01-12",
    preferredCategories: ["Electronics", "Home"],
    overstockInterest: ["Bluetooth Headphones", "Sony WH-1000XM5"],
    loyaltyScore: 76,
    couponsSent: 4,
    conversionRate: 50.0,
    status: "regular",
  },
  {
    id: "4",
    name: "Sneha Reddy",
    email: "sneha.reddy@email.com",
    phone: "+91 65432 10987",
    totalOrders: 8,
    totalSpent: 68000, // ₹68,000
    avgOrderValue: 8500, // ₹8,500
    lastOrderDate: "2024-01-11",
    preferredCategories: ["Clothing", "Electronics"],
    overstockInterest: ["Winter Jacket - XL", "Bluetooth Headphones"],
    loyaltyScore: 68,
    couponsSent: 3,
    conversionRate: 66.7,
    status: "regular",
  },
  {
    id: "5",
    name: "Vikram Singh",
    email: "vikram.singh@email.com",
    phone: "+91 54321 09876",
    totalOrders: 15,
    totalSpent: 125000, // ₹1,25,000
    avgOrderValue: 8333, // ₹8,333
    lastOrderDate: "2024-01-10",
    preferredCategories: ["Electronics", "Footwear"],
    overstockInterest: ["Sony WH-1000XM5", "Running Shoes - Size 10"],
    loyaltyScore: 82,
    couponsSent: 5,
    conversionRate: 80.0,
    status: "vip",
  },
  {
    id: "6",
    name: "Anita Gupta",
    email: "anita.gupta@email.com",
    phone: "+91 43210 98765",
    totalOrders: 3,
    totalSpent: 25000, // ₹25,000
    avgOrderValue: 8333, // ₹8,333
    lastOrderDate: "2024-01-09",
    preferredCategories: ["Clothing"],
    overstockInterest: ["Summer Dress - M", "Levi's 501 Jeans"],
    loyaltyScore: 45,
    couponsSent: 1,
    conversionRate: 100.0,
    status: "new",
  },
]

const overstockProducts = [
  {
    name: "Sony WH-1000XM5",
    sku: "SONY-WH1000XM5",
    currentStock: 120,
    originalPrice: 29999,
    discountPrice: 23999,
    discount: 20,
    interestedCustomers: 8,
  },
  {
    name: "Winter Jacket - XL",
    sku: "CLTH-WJ-XL-BLU",
    currentStock: 85,
    originalPrice: 7199,
    discountPrice: 5759,
    discount: 20,
    interestedCustomers: 6,
  },
  {
    name: "Bluetooth Headphones",
    sku: "ELEC-BH-WH-001",
    currentStock: 60,
    originalPrice: 15999,
    discountPrice: 12799,
    discount: 20,
    interestedCustomers: 5,
  },
  {
    name: "Summer Dress - M",
    sku: "CLTH-SD-M-RED",
    currentStock: 120,
    originalPrice: 3999,
    discountPrice: 3199,
    discount: 20,
    interestedCustomers: 4,
  },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    const matchesCategory = categoryFilter === "all" || customer.preferredCategories.includes(categoryFilter)

    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "vip":
        return <Badge className="bg-purple-100 text-purple-800">VIP</Badge>
      case "regular":
        return <Badge className="bg-blue-100 text-blue-800">Regular</Badge>
      case "new":
        return <Badge className="bg-green-100 text-green-800">New</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleSendTargetedCoupon = async (customerId: string, customerName: string, product: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update customer coupon count
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === customerId ? { ...customer, couponsSent: customer.couponsSent + 1 } : customer,
        ),
      )

      toast({
        title: "Targeted Coupon Sent!",
        description: `Personalized coupon for ${product} sent to ${customerName}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send coupon. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkCouponSend = async (productName: string, interestedCount: number) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Bulk Coupons Sent!",
        description: `${interestedCount} personalized coupons sent for ${productName}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send bulk coupons. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const vipCustomers = customers.filter((c) => c.status === "vip").length
  const totalCustomers = customers.length
  const avgLoyaltyScore = customers.reduce((sum, c) => sum + c.loyaltyScore, 0) / customers.length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
              <p className="text-muted-foreground">Target customers with personalized coupons for overstocked items</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email Campaign
              </Button>
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                SMS Campaign
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCustomers}</div>
                <p className="text-xs text-muted-foreground">{vipCustomers} VIP customers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">From all customers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Loyalty Score</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgLoyaltyScore.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Customer satisfaction</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overstock Targeting</CardTitle>
                <Target className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">Customers targeted this week</p>
              </CardContent>
            </Card>
          </div>

          {/* Overstock Targeting Strategy */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                AI-Powered Overstock Clearance Strategy
              </CardTitle>
              <CardDescription>
                Target customers who frequently buy overstocked items with personalized coupons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Overstocked Products</h3>
                  {overstockProducts.map((product) => (
                    <div key={product.sku} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Stock: {product.currentStock} | {product.interestedCustomers} interested customers
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm line-through text-muted-foreground">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            ₹{product.discountPrice.toLocaleString()}
                          </span>
                          <Badge className="bg-green-100 text-green-800">{product.discount}% OFF</Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleBulkCouponSend(product.name, product.interestedCustomers)}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Send to {product.interestedCustomers}
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Strategy Benefits</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 border rounded-lg bg-white">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Fast Inventory Clearance</div>
                        <div className="text-sm text-muted-foreground">
                          Target customers with proven interest in specific products
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 border rounded-lg bg-white">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Higher Conversion Rates</div>
                        <div className="text-sm text-muted-foreground">
                          Personalized offers based on purchase history
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 border rounded-lg bg-white">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Reduced Storage Costs</div>
                        <div className="text-sm text-muted-foreground">
                          Clear overstock before it becomes dead inventory
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 border rounded-lg bg-white">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Customer Satisfaction</div>
                        <div className="text-sm text-muted-foreground">
                          Customers get deals on products they actually want
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer List */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Database</CardTitle>
              <CardDescription>Manage customers and send targeted promotions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Customer Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category Interest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Footwear">Footwear</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Loyalty Score</TableHead>
                      <TableHead>Overstock Interest</TableHead>
                      <TableHead>Conversion Rate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.email}</div>
                            <div className="text-xs text-muted-foreground">{customer.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <ShoppingCart className="h-3 w-3" />
                            {customer.totalOrders}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">₹{customer.totalSpent.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">
                              Avg: ₹{customer.avgOrderValue.toLocaleString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            {customer.loyaltyScore}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {customer.overstockInterest.slice(0, 2).map((product, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {product}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{customer.conversionRate}%</div>
                            <div className="text-xs text-muted-foreground">{customer.couponsSent} sent</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {customer.overstockInterest.length > 0 && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleSendTargetedCoupon(customer.id, customer.name, customer.overstockInterest[0])
                                }
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Gift className="h-3 w-3 mr-1" />
                                Send Coupon
                              </Button>
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
        </div>
      </main>
    </div>
  )
}
