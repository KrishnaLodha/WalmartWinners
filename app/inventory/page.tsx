"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TopNavbar } from "@/components/top-navbar"
import { useToast } from "@/hooks/use-toast"
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Search,
  Download,
  RefreshCw,
  Zap,
  BarChart3,
  Clock,
  MapPin,
} from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  current_stock: number
  max_stock: number
  reorder_point: number
  price: number
  warehouse_id: string
  warehouse_name: string
  demand_forecast_7_days: number[]
  avg_daily_sales: number
  lead_time_days: number
  stock_level: number
  total_forecasted_demand: number
  days_remaining: number
  status: "critical" | "low" | "healthy" | "overstock"
}

const statusColors = {
  critical: "bg-red-100 text-red-800 border-red-200",
  low: "bg-yellow-100 text-yellow-800 border-yellow-200",
  healthy: "bg-green-100 text-green-800 border-green-200",
  overstock: "bg-blue-100 text-blue-800 border-blue-200",
}

const statusLabels = {
  critical: "Critical",
  low: "Low Stock",
  healthy: "Healthy",
  overstock: "Overstock",
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [isRedistributing, setIsRedistributing] = useState(false)
  const { toast } = useToast()

  const [newItem, setNewItem] = useState({
    name: "",
    sku: "",
    category: "",
    current_stock: 0,
    max_stock: 0,
    reorder_point: 0,
    price: 0,
    warehouse_id: "",
    demand_forecast_7_days: [0, 0, 0, 0, 0, 0, 0],
  })

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await fetch("/api/inventory")
      const data = await response.json()
      setInventory(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch inventory data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async () => {
    try {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })

      if (response.ok) {
        const addedItem = await response.json()
        setInventory([...inventory, addedItem])
        setIsAddDialogOpen(false)
        setNewItem({
          name: "",
          sku: "",
          category: "",
          current_stock: 0,
          max_stock: 0,
          reorder_point: 0,
          price: 0,
          warehouse_id: "",
          demand_forecast_7_days: [0, 0, 0, 0, 0, 0, 0],
        })
        toast({
          title: "Success",
          description: "Item added successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      })
    }
  }

  const handleEditItem = async () => {
    if (!editingItem) return

    try {
      const response = await fetch(`/api/inventory/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      })

      if (response.ok) {
        const updatedItem = await response.json()
        setInventory(inventory.map((item) => (item.id === editingItem.id ? updatedItem : item)))
        setEditingItem(null)
        toast({
          title: "Success",
          description: "Item updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      })
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setInventory(inventory.filter((item) => item.id !== id))
        toast({
          title: "Success",
          description: "Item deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  const handleReplenish = async (productId: string) => {
    try {
      const response = await fetch("/api/inventory/replenish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, urgency: "normal" }),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Replenishment Order Created",
          description: `Order ${result.orderId} for ${result.quantity} units created successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create replenishment order",
        variant: "destructive",
      })
    }
  }

  const handleAIRedistribution = async () => {
    setIsRedistributing(true)
    try {
      const response = await fetch("/api/inventory/redistribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ algorithm: "ai_optimization" }),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "AI Redistribution Complete",
          description: `${result.redistributions.length} items redistributed for optimal efficiency`,
        })
        fetchInventory() // Refresh data
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform AI redistribution",
        variant: "destructive",
      })
    } finally {
      setIsRedistributing(false)
    }
  }

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const criticalItems = inventory.filter((item) => item.status === "critical").length
  const lowStockItems = inventory.filter((item) => item.status === "low").length
  const overstockItems = inventory.filter((item) => item.status === "overstock").length
  const totalValue = inventory.reduce((sum, item) => sum + item.current_stock * item.price, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading inventory data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Smart Inventory Management</h1>
              <p className="text-gray-600">AI-powered inventory optimization and real-time tracking</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleAIRedistribution}
                disabled={isRedistributing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isRedistributing ? "Redistributing..." : "AI Redistribute"}
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Inventory Item</DialogTitle>
                    <DialogDescription>Enter the details for the new inventory item.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={newItem.sku}
                        onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                        placeholder="Enter SKU"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newItem.category}
                        onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Clothing">Clothing</SelectItem>
                          <SelectItem value="Footwear">Footwear</SelectItem>
                          <SelectItem value="Home">Home</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="current_stock">Current Stock</Label>
                        <Input
                          id="current_stock"
                          type="number"
                          value={newItem.current_stock}
                          onChange={(e) =>
                            setNewItem({ ...newItem, current_stock: Number.parseInt(e.target.value) || 0 })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="max_stock">Max Stock</Label>
                        <Input
                          id="max_stock"
                          type="number"
                          value={newItem.max_stock}
                          onChange={(e) => setNewItem({ ...newItem, max_stock: Number.parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="reorder_point">Reorder Point</Label>
                        <Input
                          id="reorder_point"
                          type="number"
                          value={newItem.reorder_point}
                          onChange={(e) =>
                            setNewItem({ ...newItem, reorder_point: Number.parseInt(e.target.value) || 0 })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newItem.price}
                          onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="warehouse">Warehouse</Label>
                      <Select
                        value={newItem.warehouse_id}
                        onValueChange={(value) => setNewItem({ ...newItem, warehouse_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="550e8400-e29b-41d4-a716-446655440001">Main Distribution Center</SelectItem>
                          <SelectItem value="550e8400-e29b-41d4-a716-446655440002">West Coast Hub</SelectItem>
                          <SelectItem value="550e8400-e29b-41d4-a716-446655440003">East Coast Facility</SelectItem>
                          <SelectItem value="550e8400-e29b-41d4-a716-446655440004">Midwest Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddItem}>Add Item</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across all locations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
                <p className="text-xs text-muted-foreground">Require immediate attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <Package className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
                <p className="text-xs text-muted-foreground">Need replenishment soon</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overstock Items</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{overstockItems}</div>
                <p className="text-xs text-muted-foreground">Consider promotions</p>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>Manage your inventory with AI-powered insights</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
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
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>Days Remaining</TableHead>
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
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>
                                {item.current_stock}/{item.max_stock}
                              </span>
                              <span className="text-muted-foreground">{item.stock_level}%</span>
                            </div>
                            <Progress value={item.stock_level} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[item.status]}>{statusLabels[item.status]}</Badge>
                        </TableCell>
                        <TableCell>₹{item.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-sm">{item.warehouse_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-sm">
                              {item.days_remaining === 999 ? "∞" : `${item.days_remaining}d`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {(item.status === "critical" || item.status === "low") && (
                              <Button
                                size="sm"
                                onClick={() => handleReplenish(item.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Replenish
                              </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
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

          {/* Edit Dialog */}
          {editingItem && (
            <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Inventory Item</DialogTitle>
                  <DialogDescription>Update the details for this inventory item.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Product Name</Label>
                    <Input
                      id="edit-name"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-sku">SKU</Label>
                    <Input
                      id="edit-sku"
                      value={editingItem.sku}
                      onChange={(e) => setEditingItem({ ...editingItem, sku: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-current-stock">Current Stock</Label>
                      <Input
                        id="edit-current-stock"
                        type="number"
                        value={editingItem.current_stock}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, current_stock: Number.parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-max-stock">Max Stock</Label>
                      <Input
                        id="edit-max-stock"
                        type="number"
                        value={editingItem.max_stock}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, max_stock: Number.parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-reorder-point">Reorder Point</Label>
                      <Input
                        id="edit-reorder-point"
                        type="number"
                        value={editingItem.reorder_point}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, reorder_point: Number.parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-price">Price (₹)</Label>
                      <Input
                        id="edit-price"
                        type="number"
                        value={editingItem.price}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, price: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setEditingItem(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleEditItem}>Save Changes</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </main>
    </div>
  )
}
