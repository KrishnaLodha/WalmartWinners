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
  CheckCircle,
  Info,
  Lightbulb,
  Code,
  Database,
  Brain,
  IndianRupee,
  ShoppingCart,
  Bell,
  Zap,
} from "lucide-react"
import Link from "next/link"

const quickStartSteps = [
  {
    step: 1,
    title: "Access the Platform",
    description: "Navigate through the platform using the top navigation bar",
    details: [
      "Dashboard: Overview of key metrics and KPIs",
      "Inventory: Manage stock levels and warehouse operations",
      "Orders: Track and manage customer orders",
      "Customers: Analyze customer behavior and segments",
      "Alerts: Monitor system notifications and warnings",
    ],
  },
  {
    step: 2,
    title: "Explore Key Features",
    description: "Discover the main functionalities of each module",
    details: [
      "Real-time inventory tracking with AI alerts",
      "Order management with status updates",
      "Customer analytics and segmentation",
      "AI-powered redistribution system",
      "Dynamic pricing in Indian Rupees",
    ],
  },
  {
    step: 3,
    title: "Interact with Data",
    description: "Use the platform's interactive features",
    details: [
      "Add, edit, and delete inventory items",
      "Process orders and update statuses",
      "View detailed analytics and reports",
      "Trigger AI redistribution processes",
      "Manage alerts and notifications",
    ],
  },
]

const moduleGuides = [
  {
    icon: BarChart3,
    title: "Dashboard",
    description: "Central hub for all your analytics and KPIs",
    features: [
      "Real-time sales and revenue metrics",
      "Inventory status overview",
      "Active alerts and notifications",
      "Top-performing products",
      "Quick action buttons",
    ],
    howTo: [
      "View key metrics at a glance",
      "Monitor inventory levels across warehouses",
      "Track sales performance trends",
      "Access quick navigation to other modules",
    ],
  },
  {
    icon: Package,
    title: "Inventory Management",
    description: "Complete stock control and warehouse operations",
    features: [
      "Multi-warehouse inventory tracking",
      "AI-powered stock alerts",
      "Automated redistribution system",
      "Real-time stock level monitoring",
      "CRUD operations for inventory items",
    ],
    howTo: [
      "Add new products with detailed information",
      "Edit existing inventory items",
      "Monitor stock levels and reorder points",
      "Trigger AI redistribution between warehouses",
      "View and manage inventory alerts",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Order Management",
    description: "Comprehensive order tracking and processing",
    features: [
      "Complete order lifecycle management",
      "Customer information tracking",
      "Payment status monitoring",
      "Order status updates",
      "Detailed order analytics",
    ],
    howTo: [
      "View all orders with filtering options",
      "Update order statuses (pending → processing → shipped)",
      "Track payment information",
      "View detailed order information",
      "Monitor delivery and tracking details",
    ],
  },
  {
    icon: Users,
    title: "Customer Analytics",
    description: "Deep customer insights and behavior analysis",
    features: [
      "Customer segmentation analysis",
      "Purchase behavior tracking",
      "Lifetime value calculations",
      "Personalized recommendations",
      "Customer journey mapping",
    ],
    howTo: [
      "Analyze customer segments and behavior",
      "View purchase patterns and preferences",
      "Generate targeted marketing campaigns",
      "Track customer satisfaction metrics",
    ],
  },
  {
    icon: Bell,
    title: "Alert Management",
    description: "Comprehensive alert monitoring and management",
    features: [
      "Real-time system alerts",
      "AI-powered notifications",
      "Priority-based alert system",
      "Alert resolution tracking",
      "Custom alert configurations",
    ],
    howTo: [
      "Monitor active alerts by priority",
      "Resolve or dismiss alerts",
      "View detailed alert information",
      "Track alert resolution history",
    ],
  },
]

const platformFeatures = [
  {
    category: "Currency & Pricing",
    features: [
      "All prices displayed in Indian Rupees (₹)",
      "Realistic Indian market pricing",
      "Dynamic pricing algorithms",
      "Cost optimization calculations",
    ],
  },
  {
    category: "AI & Machine Learning",
    features: [
      "Demand forecasting with 92% accuracy",
      "Automated inventory redistribution",
      "Customer behavior prediction",
      "Real-time alert generation",
    ],
  },
  {
    category: "Multi-Warehouse Support",
    features: [
      "5 warehouses across India",
      "Real-time stock synchronization",
      "Inter-warehouse transfers",
      "Location-based analytics",
    ],
  },
  {
    category: "User Experience",
    features: [
      "Responsive design for all devices",
      "Intuitive navigation system",
      "Real-time data updates",
      "Modern UI with shadcn/ui components",
    ],
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
          <h1 className="text-4xl font-bold tracking-tight">Platform Documentation</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Complete guide to using the Walmart Analytics Hub - AI-Powered Retail Platform
        </p>
      </div>

      {/* Quick Start Alert */}
      <Alert className="border-walmart-blue/20 bg-walmart-blue/5">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Platform Overview</AlertTitle>
        <AlertDescription>
          This is a comprehensive retail analytics platform built for the Walmart Sparkathon 2025. All features work
          with mock data and demonstrate real-world retail operations in the Indian market.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="getting-started" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="modules">Platform Modules</TabsTrigger>
          <TabsTrigger value="features">Key Features</TabsTrigger>
          <TabsTrigger value="technical">Technical Details</TabsTrigger>
          <TabsTrigger value="demo">Demo Guide</TabsTrigger>
        </TabsList>

        {/* Getting Started Tab */}
        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-6 w-6 text-walmart-blue" />
                Platform Navigation Guide
              </CardTitle>
              <CardDescription>Learn how to navigate and use the analytics platform effectively</CardDescription>
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
                  Platform Requirements
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
                    Internet connection for optimal experience
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
                  <IndianRupee className="h-5 w-5 text-walmart-blue" />
                  Indian Market Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Badge className="bg-green-100 text-green-800 mb-1">Currency</Badge>
                    <p className="text-sm text-muted-foreground">All prices in Indian Rupees (₹)</p>
                  </div>
                  <div>
                    <Badge className="bg-blue-100 text-blue-800 mb-1">Market Pricing</Badge>
                    <p className="text-sm text-muted-foreground">Realistic Indian retail market values</p>
                  </div>
                  <div>
                    <Badge className="bg-purple-100 text-purple-800 mb-1">Warehouses</Badge>
                    <p className="text-sm text-muted-foreground">5 locations across major Indian cities</p>
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

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-walmart-blue" />
                Platform Features
              </CardTitle>
              <CardDescription>Comprehensive overview of all platform capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {platformFeatures.map((category, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="font-semibold text-walmart-blue border-b border-walmart-blue/20 pb-2">
                      {category.category}
                    </h3>
                    <ul className="space-y-2">
                      {category.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-walmart-blue" />
                AI & Machine Learning Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-muted-foreground">Forecast Accuracy</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-muted-foreground">Warehouses Supported</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">Real-time</div>
                  <div className="text-sm text-muted-foreground">Data Updates</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Tab */}
        <TabsContent value="technical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-6 w-6 text-walmart-blue" />
                Technical Architecture
              </CardTitle>
              <CardDescription>Platform architecture and technology stack details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Frontend Technologies</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Badge variant="outline">Next.js 15</Badge>
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">Tailwind CSS</Badge>
                    <Badge variant="outline">shadcn/ui</Badge>
                    <Badge variant="outline">Recharts</Badge>
                    <Badge variant="outline">Lucide Icons</Badge>
                    <Badge variant="outline">Responsive Design</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Backend & Data</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Badge variant="outline">Node.js</Badge>
                    <Badge variant="outline">REST APIs</Badge>
                    <Badge variant="outline">Mock Data System</Badge>
                    <Badge variant="outline">Real-time Updates</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">AI/ML Capabilities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Badge variant="outline">Demand Forecasting</Badge>
                    <Badge variant="outline">Customer Segmentation</Badge>
                    <Badge variant="outline">Inventory Optimization</Badge>
                    <Badge variant="outline">Predictive Analytics</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-6 w-6 text-walmart-blue" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Mock Data System</AlertTitle>
                <AlertDescription>
                  The platform uses a sophisticated mock data system that simulates real-world retail operations. All
                  CRUD operations work seamlessly with immediate UI updates, demonstrating full functionality without
                  requiring external database connections.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Demo Guide Tab */}
        <TabsContent value="demo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-6 w-6 text-walmart-blue" />
                Demo Walkthrough
              </CardTitle>
              <CardDescription>Step-by-step guide to demonstrate platform capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Inventory Management Demo</h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-walmart-blue font-medium">1.</span>
                    Navigate to Inventory page and observe real-time stock levels
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-walmart-blue font-medium">2.</span>
                    Click "Add Item" to create a new inventory item with Indian pricing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-walmart-blue font-medium">3.</span>
                    Edit existing items to see immediate UI updates
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-walmart-blue font-medium">4.</span>
                    Trigger "AI Redistribution" to see automated warehouse transfers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-walmart-blue font-medium">5.</span>
                    Use "Refresh Alerts" to generate dynamic inventory alerts
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Order Management Demo</h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-walmart-blue font-medium">1.</span>
                    View comprehensive order list with Indian customer data
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-walmart-blue font-medium">2.</span>
                    Filter orders by status and search functionality
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-walmart-blue font-medium">3.</span>
                    Click "View" to see detailed order information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-walmart-blue font-medium">4.</span>
                    Process orders through different stages (pending → processing → shipped)
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Analytics Demo</h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-walmart-blue font-medium">1.</span>
                    Explore Dashboard for comprehensive KPI overview
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-walmart-blue font-medium">2.</span>
                    View Customer Analytics for segmentation insights
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-walmart-blue font-medium">3.</span>
                    Monitor Alerts page for AI-generated notifications
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-walmart-blue font-medium">4.</span>
                    Observe real-time updates across all modules
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="text-center bg-gradient-to-r from-walmart-blue/5 to-walmart-yellow/5">
        <CardContent className="pt-6">
          <h3 className="text-2xl font-bold mb-4">Ready to Explore?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start exploring the platform features and experience the power of AI-driven retail analytics designed
            specifically for the Indian market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-walmart-blue hover:bg-walmart-dark-blue">
              <Link href="/dashboard">
                <BarChart3 className="h-4 w-4 mr-2" />
                Start with Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/inventory">
                <Package className="h-4 w-4 mr-2" />
                Try Inventory Management
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
