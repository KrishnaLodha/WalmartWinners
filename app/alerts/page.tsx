"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Bell, CheckCircle, Clock, Search, Zap, Eye, X, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Alert {
  id: string
  type: string
  priority: "low" | "medium" | "high" | "critical"
  product_id: string
  product_name: string
  sku: string
  warehouse: string
  title: string
  message: string
  description: string
  action: string
  severity: "info" | "warning" | "critical"
  ml_confidence: number
  status: "active" | "resolved" | "dismissed"
  created_at: string
  resolved_at?: string
  resolved_by?: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/inventory/alerts")
      if (response.ok) {
        const data = await response.json()
        setAlerts(data || [])
      }
    } catch (error) {
      console.error("Failed to fetch alerts:", error)
      toast({
        title: "Error",
        description: "Failed to fetch alerts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Bell className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "destructive"
      case "resolved":
        return "default"
      case "dismissed":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const resolveAlert = (alertId: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "resolved" as const,
              resolved_at: new Date().toISOString(),
              resolved_by: "Current User",
            }
          : alert,
      ),
    )

    toast({
      title: "Alert Resolved",
      description: "Alert has been marked as resolved",
    })
  }

  const dismissAlert = (alertId: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "dismissed" as const,
              resolved_at: new Date().toISOString(),
              resolved_by: "Current User",
            }
          : alert,
      ),
    )

    toast({
      title: "Alert Dismissed",
      description: "Alert has been dismissed",
    })
  }

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.warehouse.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPriority = priorityFilter === "all" || alert.priority === priorityFilter
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter

    return matchesSearch && matchesPriority && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const activeAlerts = alerts.filter((alert) => alert.status === "active").length
  const criticalAlerts = alerts.filter((alert) => alert.priority === "critical" && alert.status === "active").length
  const resolvedToday = alerts.filter(
    (alert) =>
      alert.status === "resolved" &&
      alert.resolved_at &&
      new Date(alert.resolved_at).toDateString() === new Date().toDateString(),
  ).length
  const avgConfidence = (alerts.reduce((sum, alert) => sum + alert.ml_confidence, 0) / alerts.length) * 100

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Alert Management</h1>
          <p className="text-muted-foreground">Monitor and manage system alerts and notifications</p>
        </div>
        <Button onClick={fetchAlerts} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Alerts
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{activeAlerts}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">High priority issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedToday}</div>
            <p className="text-xs text-muted-foreground">Issues resolved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{avgConfidence.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average ML confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>Monitor and manage all system alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getSeverityIcon(alert.severity)}
                      <h3 className="font-semibold text-lg">{alert.title}</h3>
                      <Badge variant={getPriorityBadgeVariant(alert.priority)}>{alert.priority}</Badge>
                      <Badge variant={getStatusBadgeVariant(alert.status)}>{alert.status}</Badge>
                    </div>

                    <p className="text-muted-foreground mb-3">{alert.message}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Product:</span>
                        <div>{alert.product_name}</div>
                      </div>
                      <div>
                        <span className="font-medium">SKU:</span>
                        <div>{alert.sku}</div>
                      </div>
                      <div>
                        <span className="font-medium">Warehouse:</span>
                        <div>{alert.warehouse}</div>
                      </div>
                      <div>
                        <span className="font-medium">Confidence:</span>
                        <div>{(alert.ml_confidence * 100).toFixed(1)}%</div>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-muted rounded-md">
                      <span className="font-medium">Recommended Action:</span>
                      <p className="text-sm mt-1">{alert.action}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Created: {new Date(alert.created_at).toLocaleString()}</span>
                      {alert.resolved_at && (
                        <>
                          <span>•</span>
                          <span>Resolved: {new Date(alert.resolved_at).toLocaleString()}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAlert(alert)
                        setIsViewDialogOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {alert.status === "active" && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => resolveAlert(alert.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => dismissAlert(alert.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredAlerts.length === 0 && (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || priorityFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "All systems are running smoothly"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alert Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Alert Details</DialogTitle>
            <DialogDescription>
              {selectedAlert && `Detailed information for alert: ${selectedAlert.title}`}
            </DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {getSeverityIcon(selectedAlert.severity)}
                <h3 className="text-xl font-semibold">{selectedAlert.title}</h3>
                <Badge variant={getPriorityBadgeVariant(selectedAlert.priority)}>{selectedAlert.priority}</Badge>
                <Badge variant={getStatusBadgeVariant(selectedAlert.status)}>{selectedAlert.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Product Information</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {selectedAlert.product_name}
                    </div>
                    <div>
                      <span className="font-medium">SKU:</span> {selectedAlert.sku}
                    </div>
                    <div>
                      <span className="font-medium">Warehouse:</span> {selectedAlert.warehouse}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Alert Information</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Type:</span> {selectedAlert.type}
                    </div>
                    <div>
                      <span className="font-medium">Confidence:</span> {(selectedAlert.ml_confidence * 100).toFixed(1)}%
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(selectedAlert.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedAlert.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Recommended Action</h4>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">{selectedAlert.action}</p>
                </div>
              </div>

              {selectedAlert.resolved_at && (
                <div>
                  <h4 className="font-semibold mb-2">Resolution Details</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Resolved At:</span>{" "}
                      {new Date(selectedAlert.resolved_at).toLocaleString()}
                    </div>
                    {selectedAlert.resolved_by && (
                      <div>
                        <span className="font-medium">Resolved By:</span> {selectedAlert.resolved_by}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedAlert?.status === "active" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    resolveAlert(selectedAlert.id)
                    setIsViewDialogOpen(false)
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Resolve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    dismissAlert(selectedAlert.id)
                    setIsViewDialogOpen(false)
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Dismiss
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
