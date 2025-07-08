"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Package, Search, Download, Plus } from "lucide-react"
import { TopNavbar } from "@/components/top-navbar"

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  currentStock: number
  optimalStock: number
  reorderPoint: number
  price: number
  status: "healthy" | "low" | "critical" | "overstock"
  lastUpdated: string
}

const mockInventoryData: InventoryItem[] = [
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
  {
    id: "3",
    name: "Nike Air Max 270",
    sku: "NIKE-AM270-BLK",
    category: "Footwear",
    currentStock: 3,
    optimalStock: 40,
    reorderPoint: 12,
    price: 149.99,
    status: "critical",
    lastUpdated: "2024-01-15T08:45:00Z",
  },
  {
    id: "4",
    name: "Winter Jacket - XL",
    sku: "CLTH-WJ-XL-BLU",
    category: "Clothing",
    currentStock: 85,
    optimalStock: 35,
    reorderPoint: 15,
    price: 89.99,
    status: "overstock",
    lastUpdated: "2024-01-15T07:20:00Z",
  },
  {
    id: "5",
    name: 'MacBook Pro 14"',
    sku: "APPL-MBP14-M3",
    category: "Electronics",
    currentStock: 8,
    optimalStock: 20,
    reorderPoint: 5,
    price: 1999.99,
    status: "low",
    lastUpdated: "2024-01-15T11:00:00Z",
  },
]

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventoryData)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "low":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Low Stock
          </Badge>
        )
      case "overstock":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Overstock
          </Badge>
        )
      case "healthy":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Healthy
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStockPercentage = (current: number, optimal: number) => {
    return Math.round((current / optimal) * 100)
  }

  const criticalItems = inventory.filter((item) => item.status === "critical").length
  const lowStockItems = inventory.filter((item) => item.status === "low").length
  const overstockItems = inventory.filter((item) => item.status === "overstock").length

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
              <p className="text-muted-foreground">Monitor and manage your store inventory levels</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-walmart-blue hover:bg-walmart-dark-blue">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventory.length}</div>
                <p className="text-xs text-muted-foreground">Active inventory items</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
                <p className="text-xs text-muted-foreground">Items need immediate attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{lowStockItems}</div>
                <p className="text-xs text-muted-foreground">Items below reorder point</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overstock</CardTitle>
                <Package className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{overstockItems}</div>
                <p className="text-xs text-muted-foreground">Items above optimal levels</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>Search and filter your inventory items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or SKU..."
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="healthy">Healthy</SelectItem>
                    <SelectItem value="overstock">Overstock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Stock Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.currentStock}</span>
                            <span className="text-muted-foreground">/ {item.optimalStock}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  getStockPercentage(item.currentStock, item.optimalStock) < 25
                                    ? "bg-red-500"
                                    : getStockPercentage(item.currentStock, item.optimalStock) < 50
                                      ? "bg-amber-500"
                                      : getStockPercentage(item.currentStock, item.optimalStock) > 150
                                        ? "bg-purple-500"
                                        : "bg-green-500"
                                }`}
                                style={{
                                  width: `${Math.min(getStockPercentage(item.currentStock, item.optimalStock), 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {getStockPercentage(item.currentStock, item.optimalStock)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              Reorder
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
        </div>
      </main>
    </div>
  )
}
