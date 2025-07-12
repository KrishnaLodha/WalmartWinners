"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Target,
  Users,
  Lightbulb,
  Award,
  TrendingUp,
  Shield,
  Globe,
  Brain,
  Zap,
  Package,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

const teamMembers = [
  {
    name: "Aditi Ghosh",
    role: "Machine Learning Engineer",
    description: "Specialist in demand forecasting, predictive analytics, and inventory optimization algorithms.",
    icon: Brain,
  },
  {
    name: "Aditi Ghosh, Sarthak Sharma, Krishna Lodha",
    role: "UX/UI Designer & Product Manager",
    description: "Creating intuitive interfaces and seamless user experiences for complex retail operations.",
    icon: Users,
  },
  {
    name: "Krishna Lodha",
    role: "Data Scientist & Analyst",
    description: "Expert in retail analytics, customer behavior analysis, and business intelligence.",
    icon: BarChart3,
  },
  {
    name: "Sarthak Sharma",
    role: "Full-Stack Developer",
    description: "Building scalable, secure, and high-performance systems for enterprise retail operations.",
    icon: Zap,
  },
]

const achievements = [
  {
    title: "Effortless Inventory",
    description: "Empowering store managers and teams with a powerful platform that makes stock management effortless, intuitive, and always under control",
    icon: Award,
    color: "bg-yellow-500",
  },
  {
    title: "95% Forecast Accuracy",
    description: "Achieved industry-leading accuracy in demand prediction through advanced AI models",
    icon: Target,
    color: "bg-blue-500",
  },
  {
    title: "80% Stockout Reduction",
    description: "Proven track record of dramatically reducing stockout incidents for retail partners",
    icon: Package,
    color: "bg-green-500",
  },
  {
    title: "Enterprise Ready",
    description: "Built for scale with enterprise-grade security, reliability, and performance",
    icon: Shield,
    color: "bg-purple-500",
  },
]

const values = [
  {
    title: "Innovation First",
    description: "We leverage cutting-edge AI and machine learning to solve real retail challenges.",
    icon: Lightbulb,
  },
  {
    title: "Customer Success",
    description: "Our success is measured by the tangible improvements we deliver to our clients.",
    icon: TrendingUp,
  },
  {
    title: "Data-Driven",
    description: "Every decision and recommendation is backed by comprehensive data analysis.",
    icon: BarChart3,
  },
  {
    title: "Scalable Solutions",
    description: "We build platforms that grow with your business, from startup to enterprise.",
    icon: Globe,
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="walmart-gradient text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-walmart-yellow text-black hover:bg-yellow-400 text-sm font-semibold px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            Walmart Sparkathon 2025
          </Badge>

          <h1 className="text-5xl font-bold mb-6">About WalSmart</h1>
          <p className="text-xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
            We're revolutionizing retail inventory management with AI-powered solutions that eliminate stock worries and
            maximize profitability for businesses of all sizes.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              To transform retail operations by providing intelligent, automated inventory management solutions that
              eliminate stockouts, reduce excess inventory, and maximize profitability through the power of AI.
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-gradient-to-r from-walmart-blue/5 to-walmart-yellow/5">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-walmart-blue rounded-full">
                  <Target className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The End of Stock Worries</h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our tagline represents our commitment to solving one of retail's biggest challenges. Whether you're
                facing shortages that lose customers or surplus that ties up capital, WalSmart's AI-powered platform
                ensures you're always covered with the right inventory at the right time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Achievements</h2>
            <p className="text-xl text-gray-600">Recognition and results that speak to our impact</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${achievement.color}`}>
                      <achievement.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{achievement.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed text-base">
                    {achievement.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-walmart-blue/10 rounded-lg">
                      <value.icon className="h-6 w-6 text-walmart-blue" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Team</h2>
            <p className="text-xl text-gray-600">
              A diverse group of experts passionate about transforming retail through technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-walmart-blue to-walmart-yellow rounded-lg">
                      <member.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <p className="text-walmart-blue font-medium">{member.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed text-base">
                    {member.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 walmart-gradient text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Inventory?</h2>
          <p className="text-xl mb-8 text-blue-100 leading-relaxed">
            Join the retailers who've already eliminated their stock worries with WalSmart's AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-walmart-yellow text-black hover:bg-yellow-400 font-semibold">
              <Link href="/dashboard">
                <BarChart3 className="h-5 w-5 mr-2" />
                Explore Dashboard
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-walmart-blue bg-transparent"
            >
              <Link href="/documentation">
                <Lightbulb className="h-5 w-5 mr-2" />
                View Documentation
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
