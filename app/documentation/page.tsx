"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  BookOpen,
  Play,
  Settings,
  BarChart3,
  Package,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  Code,
  Database,
  Brain,
} from "lucide-react"
import Link from "next/link"

const quickStartSteps = [
  {
    step: 1,
    title: "Login to the System",
    description: "Use your credentials to access the analytics platform",
    details: [
      "Admin: admin@walmart.com / admin123",
      "Manager: manager@walmart.com / manager123",
      "Analyst: analyst@walmart.com / analyst123",
    ],
  },
  {
    step: 2,
    title: "Explore the Dashboard",
    description: "Get an overview of your key metrics and performance indicators",
    details: [
      "View real-time sales data",
      "Monitor inventory levels",
      "Check active alerts",
      "Review top-performing products",
    ],
  },
  {
    step: 3,
    title: "Navigate Key Modules",
    description: "Access different sections based on your role and needs",
    details: [
      "Inventory Management for stock control",
      "Sales Analytics for performance insights",
      "Demand Forecasting for planning",
      "Customer Analytics for segmentation",
    ],
  },
]

const moduleGuides = [
  {
    icon: BarChart3,
    title: "Dashboard",
    description: "Central hub for all your analytics",
    features: [
      "Real-time KPI monitoring",
      "Interactive charts and graphs",
      "Alert notifications",
      "Quick action buttons",
    ],
    howTo: [
      "Access from the main navigation",
      "Use filters to customize views",
      "Click on charts for detailed drill-downs",
      "Set up custom alerts and notifications",
    ],
  },
  {
    icon: Package,
    title: "Inventory Management",
    description: "Complete stock control and monitoring",
    features: ["Real-time stock levels", "Automated reorder alerts", "Category-wise analysis", "Supplier management"],
    howTo: [
      "Search products by name or SKU",
      "Filter by category or status",
      "Set reorder points and optimal levels",
      "Export inventory reports",
    ],
  },
  {
    icon: TrendingUp,
    title: "Demand Forecasting",
    description: "AI-powered demand predictions",
    features: [
      "ML-based forecasting models",
      "Seasonal trend analysis",
      "External factor integration",
      "Confidence intervals",
    ],
    howTo: [
      "Select products for forecasting",
      "Choose forecast horizon (days/weeks)",
      "Review model accuracy metrics",
      "Export forecast data for planning",
    ],
  },
  {
    icon: Users,
    title: "Customer Analytics",
    description: "Deep customer insights and segmentation",
    features: ["Customer segmentation", "Purchase behavior analysis", "Lifetime value calculation", "Churn prediction"],
    howTo: [
      "View customer segments",
      "Analyze purchase patterns",
      "Create targeted campaigns",
      "Track customer journey",
    ],
  },
]

const apiEndpoints = [
  {
    method: "GET",
    endpoint: "/api/dashboard",
    description: "Retrieve dashboard metrics and KPIs",
    response: "Dashboard data with sales, inventory, and alerts",
  },
  {
    method: "GET",
    endpoint: "/api/inventory",
    description: "Get inventory items with stock levels",
    response: "Array of inventory items with current stock",
  },
  {
    method: "POST",
    endpoint: "/api/inventory",
    description: "Add new inventory item",
    response: "Created inventory item with generated ID",
  },
  {
    method: "GET",
    endpoint: "/api/forecast",
    description: "Get demand forecasting data",
    response: "Forecast predictions with confidence scores",
  },
  {
    method: "GET",
    endpoint: "/api/customers",
    description: "Retrieve customer data and segments",
    response: "Customer information with segmentation",
  },
]

export default function DocumentationPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-walmart-blue rounded-full">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Complete guide to using the Walmart Analytics Hub platform
        </p>
      </div>

      {/* Quick Start Alert */}
      <Alert className="border-walmart-blue/20 bg-walmart-blue/5">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Quick Start Tip</AlertTitle>
        <AlertDescription>
          New to the platform? Start with the Dashboard to get an overview, then explore specific modules based on your
          role.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="getting-started" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Getting Started Tab */}
        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-6 w-6 text-walmart-blue" />
                Quick Start Guide
              </CardTitle>
              <CardDescription>Get up and running with the analytics platform in minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {quickStartSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-walmart-blue text-white rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                      <p className="text-muted-foreground mb-3">{step.description}</p>
                      <ul className="space-y-1">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-walmart-blue" />
                  System Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Modern web browser (Chrome, Firefox, Safari, Edge)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Internet connection for real-time data
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    JavaScript enabled
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Screen resolution: 1024x768 or higher
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-walmart-blue" />
                  User Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Badge className="bg-red-100 text-red-800 mb-1">Admin</Badge>
                    <p className="text-sm text-muted-foreground">Full system access and configuration</p>
                  </div>
                  <div>
                    <Badge className="bg-blue-100 text-blue-800 mb-1">Store Manager</Badge>
                    <p className="text-sm text-muted-foreground">Store-level analytics and inventory management</p>
                  </div>
                  <div>
                    <Badge className="bg-green-100 text-green-800 mb-1">Analyst</Badge>
                    <p className="text-sm text-muted-foreground">Data analysis and reporting capabilities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {moduleGuides.map((module, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-walmart-blue/10 rounded-lg">
                      <module.icon className="h-6 w-6 text-walmart-blue" />
                    </div>
                    {module.title}
                  </CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {module.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-walmart-yellow rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">How to Use:</h4>
                    <ul className="space-y-1">
                      {module.howTo.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2 text-sm">
                          <span className="text-walmart-blue font-medium">{stepIndex + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* API Reference Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-6 w-6 text-walmart-blue" />
                API Endpoints
              </CardTitle>
              <CardDescription>RESTful API endpoints for integrating with external systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={endpoint.method === "GET" ? "secondary" : "default"}>{endpoint.method}</Badge>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{endpoint.endpoint}</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{endpoint.description}</p>
                    <p className="text-sm">
                      <strong>Response:</strong> {endpoint.response}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-6 w-6 text-walmart-blue" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>API Authentication</AlertTitle>
                <AlertDescription>
                  All API requests require authentication. Include the JWT token in the Authorization header:
                  <code className="block mt-2 bg-gray-100 p-2 rounded">Authorization: Bearer {"<your-jwt-token>"}</code>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Troubleshooting Tab */}
        <TabsContent value="troubleshooting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                Common Issues & Solutions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Login Issues</h3>
                <div className="space-y-3">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Problem: Cannot login with credentials</AlertTitle>
                    <AlertDescription>
                      <strong>Solution:</strong> Ensure you're using the correct demo credentials:
                      <ul className="mt-2 space-y-1">
                        <li>• Admin: admin@walmart.com / admin123</li>
                        <li>• Manager: manager@walmart.com / manager123</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Data Loading Issues</h3>
                <div className="space-y-3">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Problem: Dashboard shows "Loading..." indefinitely</AlertTitle>
                    <AlertDescription>
                      <strong>Solutions:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• Refresh the page (Ctrl+F5 or Cmd+Shift+R)</li>
                        <li>• Check your internet connection</li>
                        <li>• Clear browser cache and cookies</li>
                        <li>• Try a different browser</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Performance Issues</h3>
                <div className="space-y-3">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Problem: Slow loading or unresponsive interface</AlertTitle>
                    <AlertDescription>
                      <strong>Solutions:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• Close unnecessary browser tabs</li>
                        <li>• Disable browser extensions temporarily</li>
                        <li>• Use a modern browser (Chrome, Firefox, Safari, Edge)</li>
                        <li>• Check system resources (RAM, CPU usage)</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-walmart-blue" />
                AI/ML Model Information
              </CardTitle>
              <CardDescription>Understanding the machine learning models powering the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Demand Forecasting Models</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <strong>XGBoost:</strong> Gradient boosting for high accuracy predictions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <strong>Random Forest:</strong> Ensemble method for robust forecasting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <strong>LSTM Networks:</strong> Deep learning for time series patterns
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Customer Segmentation</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <strong>K-Means Clustering:</strong> Automatic customer grouping
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <strong>RFM Analysis:</strong> Recency, Frequency, Monetary segmentation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <strong>Behavioral Analysis:</strong> Purchase pattern recognition
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-muted-foreground">Forecast Accuracy</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">0.85</div>
                  <div className="text-sm text-muted-foreground">Silhouette Score</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">15ms</div>
                  <div className="text-sm text-muted-foreground">Avg Response Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="text-center bg-gradient-to-r from-walmart-blue/5 to-walmart-yellow/5">
        <CardContent className="pt-6">
          <h3 className="text-2xl font-bold mb-4">Need More Help?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Explore our platform hands-on or check out the project details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-walmart-blue hover:bg-walmart-dark-blue">
              <Link href="/dashboard">
                <BarChart3 className="h-4 w-4 mr-2" />
                Try the Platform
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/about">
                <Info className="h-4 w-4 mr-2" />
                About the Project
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
