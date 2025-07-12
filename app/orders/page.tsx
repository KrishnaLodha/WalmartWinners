"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingCart, Package, TrendingUp, Eye, Search, User, MapPin, CreditCard, Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  billing_address: string
  total_amount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  payment_status: "pending" | "paid" | "failed" | "refunded"
  payment_method: string
  items: OrderItem[]
  created_at: string
  updated_at: string
  estimated_delivery: string
  tracking_number?: string
}

interface OrderItem {
  id: string
  product_name: string
  sku: string
  quantity: number
  unit_price: number
  total_price: number
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: "1",
      order_number: "ORD-2024-001",
      customer_name: "Rajesh Kumar",
      customer_email: "rajesh.kumar@email.com",
      customer_phone: "+91 98765 43210",
      shipping_address: "123 MG Road, Bangalore, Karnataka 560001",
      billing_address: "123 MG Road, Bangalore, Karnataka 560001",
      total_amount: 94998,
      status: "processing",
      payment_status: "paid",
      payment_method: "UPI",
      items: [
        {
          id: "1",
          product_name: "iPhone 15 Pro",
          sku: "APPL-IP15P-128",
          quantity: 1,
          unit_price: 79999,
          total_price: 79999,
        },
        {
          id: "2",
          product_name: "Sony WH-1000XM5",
          sku: "SONY-WH1000XM5",
          quantity: 1,
          unit_price: 24999,
          total_price: 24999,
        },
      ],
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T14:20:00Z",
      estimated_delivery: "2024-01-18T18:00:00Z",
      tracking_number: "TRK123456789",
    },
    {
      id: "2",
      order_number: "ORD-2024-002",
      customer_name: "Priya Sharma",
      customer_email: "priya.sharma@email.com",
      customer_phone: "+91 87654 32109",
      shipping_address: "456 Park Street, Mumbai, Maharashtra 400001",
      billing_address: "456 Park Street, Mumbai, Maharashtra 400001",
      total_amount: 184998,
      status: "shipped",
      payment_status: "paid",
      payment_method: "Credit Card",
      items: [
        {
          id: "3",
          product_name: "MacBook Air M3",
          sku: "APPL-MBA-M3-512",
          quantity: 1,
          unit_price: 114999,
          total_price: 114999,
        },
        {
          id: "4",
          product_name: "Samsung Galaxy S24",
          sku: "SAMS-GS24-256",
          quantity: 1,
          unit_price: 69999,
          total_price: 69999,
        },
      ],
      created_at: "2024-01-14T15:45:00Z",
      updated_at: "2024-01-15T09:30:00Z",
      estimated_delivery: "2024-01-17T16:00:00Z",
      tracking_number: "TRK987654321",
    },
    {
      id: "3",
      order_number: "ORD-2024-003",
      customer_name: "Amit Patel",
      customer_email: "amit.patel@email.com",
      customer_phone: "+91 76543 21098",
      shipping_address: "789 Civil Lines, Delhi, Delhi 110001",
      billing_address: "789 Civil Lines, Delhi, Delhi 110001",
      total_amount: 17998,
      status: "delivered",
      payment_status: "paid",
      payment_method: "Net Banking",
      items: [
        {
          id: "5",
          product_name: "Nike Air Max 270",
          sku: "NIKE-AM270-BLK-10",
          quantity: 1,
          unit_price: 12999,
          total_price: 12999,
        },
        {
          id: "6",
          product_name: "Levi's 501 Jeans",
          sku: "LEVI-501-32-BLU",
          quantity: 1,
          unit_price: 4999,
          total_price: 4999,
        },
      ],
      created_at: "2024-01-12T11:20:00Z",
      updated_at: "2024-01-14T17:45:00Z",
      estimated_delivery: "2024-01-15T14:00:00Z",
      tracking_number: "TRK456789123",
    },
    {
      id: "4",
      order_number: "ORD-2024-004",
      customer_name: "Sneha Reddy",
      customer_email: "sneha.reddy@email.com",
      customer_phone: "+91 65432 10987",
      shipping_address: "321 Tank Bund Road, Hyderabad, Telangana 500001",
      billing_address: "321 Tank Bund Road, Hyderabad, Telangana 500001",
      total_amount: 69999,
      status: "pending",
      payment_status: "pending",
      payment_method: "COD",
      items: [
        {
          id: "7",
          product_name: "Samsung Galaxy S24",
          sku: "SAMS-GS24-256",
          quantity: 1,
          unit_price: 69999,
          total_price: 69999,
        },
      ],
      created_at: "2024-01-15T16:10:00Z",
      updated_at: "2024-01-15T16:10:00Z",
      estimated_delivery: "2024-01-20T18:00:00Z",
    },
    {
      id: "5",
      order_number: "ORD-2024-005",
      customer_name: "Vikram Singh",
      customer_email: "vikram.singh@email.com",
      customer_phone: "+91 54321 09876",
      shipping_address: "654 Mall Road, Shimla, Himachal Pradesh 171001",
      billing_address: "654 Mall Road, Shimla, Himachal Pradesh 171001",
      total_amount: 24999,
      status: "cancelled",
      payment_status: "refunded",
      payment_method: "UPI",
      items: [
        {
          id: "8",
          product_name: "Sony WH-1000XM5",
          sku: "SONY-WH1000XM5",
          quantity: 1,
          unit_price: 24999,
          total_price: 24999,
        },
      ],
      created_at: "2024-01-13T09:15:00Z",
      updated_at: "2024-01-14T12:30:00Z",
      estimated_delivery: "2024-01-18T16:00:00Z",
    },
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "processing":
        return "default"
      case "shipped":
        return "outline"
      case "delivered":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "paid":
        return "default"
      case "failed":
        return "destructive"
      case "refunded":
        return "outline"
      default:
        return "secondary"
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus, updated_at: new Date().toISOString() } : order,
      ),
    )

    toast({
      title: "Order Updated",
      description: `Order status updated to ${newStatus}`,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const totalOrders = orders.length
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const totalRevenue = orders
    .filter((order) => order.payment_status === "paid")
    .reduce((sum, order) => sum + order.total_amount, 0)
  const averageOrderValue = totalRevenue / orders.filter((order) => order.payment_status === "paid").length || 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From paid orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{averageOrderValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Per order average</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>View and manage all customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer_name}</div>
                        <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{order.items.length} items</TableCell>
                    <TableCell className="font-medium">₹{order.total_amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPaymentStatusBadgeVariant(order.payment_status)}>{order.payment_status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {order.status === "pending" && (
                          <Button variant="outline" size="sm" onClick={() => updateOrderStatus(order.id, "processing")}>
                            Process
                          </Button>
                        )}
                        {order.status === "processing" && (
                          <Button variant="outline" size="sm" onClick={() => updateOrderStatus(order.id, "shipped")}>
                            Ship
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

      {/* Order Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>{selectedOrder && `Order ${selectedOrder.order_number} details`}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <p>{selectedOrder.customer_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p>{selectedOrder.customer_email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p>{selectedOrder.customer_phone}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedOrder.shipping_address}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="mt-1">
                        <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>{selectedOrder.status}</Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Payment Status</Label>
                      <div className="mt-1">
                        <Badge variant={getPaymentStatusBadgeVariant(selectedOrder.payment_status)}>
                          {selectedOrder.payment_status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Payment Method</Label>
                      <p>{selectedOrder.payment_method}</p>
                    </div>
                  </div>
                  {selectedOrder.tracking_number && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Tracking Number</Label>
                      <p className="font-mono">{selectedOrder.tracking_number}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product_name}</TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{item.unit_price.toLocaleString()}</TableCell>
                          <TableCell>₹{item.total_price.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 text-right">
                    <div className="text-lg font-bold">Total: ₹{selectedOrder.total_amount.toLocaleString()}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
