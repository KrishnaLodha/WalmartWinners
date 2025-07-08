"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart3,
  Package,
  TrendingUp,
  Users,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  Target,
  Brain,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

const features = [
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Monitor sales, inventory, and performance metrics in real-time with interactive dashboards.",
    color: "bg-blue-500",
  },
  {
    icon: Brain,
    title: "AI-Powered Forecasting",
    description: "Predict demand patterns and optimize inventory levels using advanced machine learning algorithms.",
    color: "bg-purple-500",
  },
  {
    icon: Users,
    title: "Customer Segmentation",
    description: "Understand your customers better with intelligent segmentation and personalized insights.",
    color: "bg-green-500",
  },
  {
    icon: Zap,
    title: "Smart Promotions",
    description: "Create targeted promotions and campaigns based on customer behavior and preferences.",
    color: "bg-yellow-500",
  },
  {
    icon: Package,
    title: "Inventory Management",
    description: "Track stock levels, manage reorders, and prevent stockouts with intelligent alerts.",
    color: "bg-red-500",
  },
  {
    icon: Target,
    title: "Performance Optimization",
    description: "Optimize operations with actionable insights and automated recommendations.",
    color: "bg-indigo-500",
  },
]

const stats = [
  { label: "Revenue Growth", value: "32%", icon: TrendingUp },
  { label: "Inventory Accuracy", value: "98.5%", icon: Package },
  { label: "Customer Satisfaction", value: "4.8/5", icon: Star },
  { label: "Cost Reduction", value: "25%", icon: Target },
]

export function WalmartLandingPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="walmart-gradient text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-walmart-yellow" />
            <h1 className="text-5xl font-bold">Walmart Analytics Hub</h1>
          </div>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Revolutionize your retail operations with AI-powered analytics, real-time insights, and intelligent
            automation. Built for the future of retail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-walmart-yellow text-black hover:bg-yellow-400 font-semibold">
              <Link href="/dashboard">
                <BarChart3 className="h-5 w-5 mr-2" />
                View Dashboard
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-walmart-blue bg-transparent"
            >
              <Link href="/about">
                Learn More
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Proven Results</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our analytics platform delivers measurable improvements across key business metrics
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-walmart-blue/10 rounded-full">
                      <stat.icon className="h-6 w-6 text-walmart-blue" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-walmart-blue mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to transform your retail operations with cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${feature.color}`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Access</h2>
            <p className="text-gray-600">Jump directly to the tools you need</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Button
              asChild
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-walmart-blue hover:text-white bg-transparent"
            >
              <Link href="/inventory">
                <Package className="h-6 w-6" />
                <span>Inventory</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-walmart-blue hover:text-white bg-transparent"
            >
              <Link href="/sales">
                <BarChart3 className="h-6 w-6" />
                <span>Sales Analytics</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-walmart-blue hover:text-white bg-transparent"
            >
              <Link href="/forecast">
                <TrendingUp className="h-6 w-6" />
                <span>Forecasting</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-walmart-blue hover:text-white bg-transparent"
            >
              <Link href="/promotions">
                <Zap className="h-6 w-6" />
                <span>Promotions</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Welcome Message for User */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-walmart-blue/20 bg-gradient-to-r from-walmart-blue/5 to-walmart-yellow/5">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-walmart-blue rounded-full">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome back, {user?.name}!</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                You're logged in as a <span className="font-semibold capitalize">{user?.role?.replace("_", " ")}</span>.
                Access your personalized dashboard and start exploring powerful analytics tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-walmart-blue hover:bg-walmart-dark-blue">
                  <Link href="/dashboard">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Go to Dashboard
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/documentation">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    View Documentation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
