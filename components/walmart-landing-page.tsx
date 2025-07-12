"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  TrendingUp,
  Package,
  Users,
  Zap,
  Target,
  Brain,
  Shield,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  TrendingDown,
  RefreshCw,
  Eye,
} from "lucide-react"
import Link from "next/link"

export function WalmartLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-8 w-8 text-yellow-400" />
              <Badge variant="secondary" className="bg-yellow-400 text-blue-900 font-semibold px-4 py-1">
                Walmart Sparkathon 2025
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              WalSmart
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 font-medium">
              The End of Stock Worries: From Shortage to Surplus, You're Covered
            </p>
            <p className="text-lg mb-10 text-blue-200 max-w-3xl mx-auto leading-relaxed">
              AI-powered inventory management that eliminates stockouts, reduces excess inventory, and maximizes
              profitability through intelligent automation and predictive analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-8 py-3"
              >
                <Link href="/dashboard">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View Dashboard
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 bg-transparent"
              >
                <Eye className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">From Inventory Chaos to Perfect Balance</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Traditional inventory management leads to costly problems. WalSmart's AI transforms these challenges into
              competitive advantages.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Traditional Problems */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center">
                <AlertTriangle className="mr-3 h-6 w-6" />
                Traditional Inventory Problems
              </h3>
              <div className="space-y-4">
                {[
                  { icon: TrendingDown, title: "Stockouts", desc: "Lost sales and disappointed customers" },
                  { icon: Package, title: "Overstock", desc: "Capital tied up in slow-moving inventory" },
                  { icon: Clock, title: "Manual Processes", desc: "Time-consuming, error-prone decisions" },
                  { icon: Target, title: "Poor Forecasting", desc: "Inaccurate demand predictions" },
                ].map((problem, index) => (
                  <Card key={index} className="border-red-200 bg-red-50">
                    <CardContent className="p-4 flex items-center">
                      <problem.icon className="h-8 w-8 text-red-500 mr-4 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-800">{problem.title}</h4>
                        <p className="text-red-600 text-sm">{problem.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* WalSmart Solutions */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
                <CheckCircle className="mr-3 h-6 w-6" />
                WalSmart AI Solutions
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Brain, title: "Predictive Analytics", desc: "AI predicts demand with 95% accuracy" },
                  { icon: RefreshCw, title: "Auto-Replenishment", desc: "Automated ordering prevents stockouts" },
                  { icon: Zap, title: "Real-time Optimization", desc: "Instant inventory level adjustments" },
                  { icon: DollarSign, title: "Profit Maximization", desc: "Optimal stock levels for maximum ROI" },
                ].map((solution, index) => (
                  <Card key={index} className="border-green-200 bg-green-50">
                    <CardContent className="p-4 flex items-center">
                      <solution.icon className="h-8 w-8 text-green-500 mr-4 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-green-800">{solution.title}</h4>
                        <p className="text-green-600 text-sm">{solution.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How WalSmart Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four simple steps to transform your inventory management from reactive to predictive
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                icon: BarChart3,
                title: "Data Integration",
                desc: "Connect your sales, inventory, and market data sources for comprehensive analysis",
              },
              {
                step: "02",
                icon: Brain,
                title: "AI Analysis",
                desc: "Machine learning algorithms analyze patterns, trends, and external factors",
              },
              {
                step: "03",
                icon: Target,
                title: "Smart Predictions",
                desc: "Generate accurate demand forecasts and optimal inventory recommendations",
              },
              {
                step: "04",
                icon: RefreshCw,
                title: "Automated Actions",
                desc: "Execute replenishment orders and inventory adjustments automatically",
              },
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-700 transition-colors">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-blue-900 font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
                {index < 3 && <ArrowRight className="h-6 w-6 text-blue-300 mx-auto mt-6 hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Inventory Intelligence</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every tool you need to master inventory management, powered by cutting-edge AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: BarChart3,
                title: "Real-time Dashboard",
                desc: "Monitor inventory levels, sales performance, and key metrics in real-time with interactive visualizations.",
                features: ["Live inventory tracking", "Performance KPIs", "Custom alerts", "Mobile responsive"],
              },
              {
                icon: TrendingUp,
                title: "Demand Forecasting",
                desc: "AI-powered predictions that account for seasonality, trends, and external factors for accurate planning.",
                features: [
                  "95% accuracy rate",
                  "Seasonal adjustments",
                  "External factor analysis",
                  "Multi-location support",
                ],
              },
              {
                icon: Package,
                title: "Smart Inventory Management",
                desc: "Automated replenishment, optimal stock levels, and intelligent redistribution across locations.",
                features: [
                  "Auto-replenishment",
                  "Safety stock optimization",
                  "Multi-location balancing",
                  "Supplier integration",
                ],
              },
              {
                icon: Users,
                title: "Customer Analytics",
                desc: "Deep insights into customer behavior, preferences, and purchasing patterns for better targeting.",
                features: [
                  "Behavioral segmentation",
                  "Purchase prediction",
                  "Lifetime value analysis",
                  "Churn prevention",
                ],
              },
              {
                icon: Zap,
                title: "Dynamic Promotions",
                desc: "AI-driven promotional strategies that maximize sales while optimizing inventory turnover.",
                features: ["Personalized offers", "Inventory-based pricing", "A/B testing", "ROI optimization"],
              },
              {
                icon: Shield,
                title: "Risk Management",
                desc: "Proactive identification and mitigation of inventory risks including stockouts and overstock situations.",
                features: ["Risk scoring", "Early warning system", "Scenario planning", "Mitigation strategies"],
              },
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                    <feature.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">{feature.desc}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Proven Results</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              WalSmart delivers measurable improvements across all key inventory metrics
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "95%", label: "Forecast Accuracy", desc: "AI predictions vs actual demand" },
              { value: "40%", label: "Stockout Reduction", desc: "Fewer out-of-stock incidents" },
              { value: "25%", label: "Inventory Cost Savings", desc: "Reduced carrying costs" },
              { value: "60%", label: "Time Savings", desc: "Less manual inventory work" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-blue-200">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to End Your Stock Worries?</h2>
            <p className="text-xl text-gray-600 mb-10">
              Join the inventory management revolution. From shortage to surplus, WalSmart has you covered with
              AI-powered intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                <Link href="/dashboard">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Start Free Trial
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 bg-transparent"
              >
                <Users className="mr-2 h-5 w-5" />
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              <h3 className="text-2xl font-bold">WalSmart</h3>
            </div>
            <p className="text-gray-400 mb-4">The End of Stock Worries: From Shortage to Surplus, You're Covered</p>
            <p className="text-sm text-gray-500">
              © 2025 WalSmart - Walmart Sparkathon 2025. Built with AI for the future of retail.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
