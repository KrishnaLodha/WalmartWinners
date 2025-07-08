"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Brain,
  Target,
  Users,
  Zap,
  BarChart3,
  Package,
  TrendingUp,
  ShoppingCart,
  Award,
  Lightbulb,
  Rocket,
  Shield,
} from "lucide-react"
import Link from "next/link"

const projectFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description:
      "Advanced machine learning algorithms for demand forecasting, customer segmentation, and predictive analytics.",
    technologies: ["XGBoost", "Random Forest", "K-Means Clustering", "LSTM Networks"],
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Live dashboards with interactive visualizations for sales, inventory, and performance metrics.",
    technologies: ["React", "Recharts", "WebSocket", "Real-time APIs"],
  },
  {
    icon: Package,
    title: "Smart Inventory Management",
    description: "Automated stock monitoring, reorder alerts, and optimization recommendations.",
    technologies: ["Automated Alerts", "Stock Optimization", "Supplier Integration"],
  },
  {
    icon: Users,
    title: "Customer Intelligence",
    description: "Deep customer insights with behavioral analysis and personalized recommendations.",
    technologies: ["Segmentation", "RFM Analysis", "Behavioral Tracking"],
  },
]

const teamMembers = [
  {
    role: "AI/ML Engineer",
    responsibilities: ["Demand Forecasting Models", "Customer Segmentation", "Predictive Analytics"],
    icon: Brain,
  },
  {
    role: "Frontend Developer",
    responsibilities: ["Dashboard Development", "User Experience", "Data Visualization"],
    icon: BarChart3,
  },
  {
    role: "Backend Developer",
    responsibilities: ["API Development", "Database Design", "System Architecture"],
    icon: Shield,
  },
  {
    role: "Product Manager",
    responsibilities: ["Requirements Analysis", "Feature Planning", "User Research"],
    icon: Target,
  },
]

const techStack = [
  { category: "Frontend", technologies: ["Next.js 15", "React", "TypeScript", "Tailwind CSS", "Recharts"] },
  { category: "Backend", technologies: ["Node.js", "SQLite", "REST APIs", "WebSocket"] },
  { category: "AI/ML", technologies: ["Python", "Scikit-learn", "XGBoost", "Pandas", "NumPy"] },
  { category: "Database", technologies: ["SQLite", "SQL", "Data Modeling"] },
  { category: "Deployment", technologies: ["Vercel", "Docker", "CI/CD"] },
]

export default function AboutPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-walmart-blue rounded-full">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">About Our Project</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Walmart Sparkathon 2024 - Revolutionizing Retail Analytics with AI-Powered Intelligence
        </p>
        <Badge className="mt-4 bg-walmart-yellow text-black hover:bg-yellow-400">
          <Award className="h-4 w-4 mr-2" />
          Walmart Sparkathon Entry
        </Badge>
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-walmart-blue" />
            Project Vision
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed">
            Our Walmart Analytics Hub is a comprehensive retail intelligence platform that transforms how retailers
            understand and optimize their operations. Built specifically for the Walmart Sparkathon, this solution
            combines cutting-edge AI/ML technologies with intuitive user experiences to deliver actionable insights.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Target className="h-8 w-8 text-walmart-blue mx-auto mb-2" />
              <h3 className="font-semibold">Mission</h3>
              <p className="text-sm text-muted-foreground">Empower retailers with intelligent analytics</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Zap className="h-8 w-8 text-walmart-yellow mx-auto mb-2" />
              <h3 className="font-semibold">Innovation</h3>
              <p className="text-sm text-muted-foreground">AI-driven automation and insights</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Impact</h3>
              <p className="text-sm text-muted-foreground">Measurable business improvements</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Key Features & Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectFeatures.map((feature, index) => (
            <Card key={index} className="border-l-4 border-l-walmart-blue">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-walmart-blue/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-walmart-blue" />
                  </div>
                  {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {feature.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-walmart-blue" />
            Technology Stack
          </CardTitle>
          <CardDescription>Modern, scalable technologies powering our analytics platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((stack, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-semibold text-walmart-blue border-b border-walmart-blue/20 pb-2">
                  {stack.category}
                </h3>
                <div className="space-y-2">
                  {stack.technologies.map((tech, techIndex) => (
                    <div key={techIndex} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-walmart-yellow rounded-full" />
                      <span className="text-sm">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-walmart-blue" />
            Team Structure & Responsibilities
          </CardTitle>
          <CardDescription>Cross-functional team bringing together diverse expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex gap-4 p-4 border rounded-lg">
                <div className="p-3 bg-walmart-blue/10 rounded-lg">
                  <member.icon className="h-6 w-6 text-walmart-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{member.role}</h3>
                  <ul className="mt-2 space-y-1">
                    {member.responsibilities.map((resp, respIndex) => (
                      <li key={respIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-walmart-yellow rounded-full" />
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Goals */}
      <Card className="bg-gradient-to-r from-walmart-blue/5 to-walmart-yellow/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-walmart-blue" />
            Project Goals & Expected Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4 text-walmart-blue">Business Objectives</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Increase sales revenue by 15-25% through better demand forecasting</span>
                </li>
                <li className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                  <span>Reduce inventory costs by 20% with optimized stock management</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                  <span>Improve customer satisfaction through personalized experiences</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <span>Automate 80% of routine inventory and promotion decisions</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-walmart-blue">Technical Achievements</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-indigo-600 mt-0.5" />
                  <span>Deploy production-ready ML models with 90%+ accuracy</span>
                </li>
                <li className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Real-time analytics processing 1M+ transactions daily</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                  <span>Enterprise-grade security and data protection</span>
                </li>
                <li className="flex items-start gap-3">
                  <Rocket className="h-5 w-5 text-blue-600 mt-0.5" />
                  <span>Scalable architecture supporting multi-store operations</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="text-center">
        <CardContent className="pt-6">
          <h3 className="text-2xl font-bold mb-4">Ready to Explore?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Dive into our comprehensive analytics platform and discover how AI can transform retail operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-walmart-blue hover:bg-walmart-dark-blue">
              <Link href="/dashboard">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/documentation">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Read Documentation
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
