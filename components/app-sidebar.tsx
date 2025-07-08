"use client"

import {
  BarChart3,
  Bell,
  Home,
  Package,
  Settings,
  ShoppingCart,
  TrendingUp,
  Users,
  Zap,
  Info,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Package,
  },
  {
    title: "Sales Analytics",
    url: "/sales",
    icon: BarChart3,
  },
  {
    title: "Demand Forecast",
    url: "/forecast",
    icon: TrendingUp,
  },
  {
    title: "Promotions",
    url: "/promotions",
    icon: Zap,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Alerts",
    url: "/alerts",
    icon: Bell,
  },
]

// Add new sections after the main navigation
const infoItems = [
  {
    title: "About",
    url: "/about",
    icon: Info,
  },
  {
    title: "Documentation",
    url: "/documentation",
    icon: BookOpen,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { state } = useSidebar()

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="walmart-gradient p-4">
        <div className="flex items-center gap-2 text-white">
          <div className="h-8 w-8 rounded bg-white/20 flex items-center justify-center">
            <Package className="h-5 w-5" />
          </div>
          {state === "expanded" && (
            <div>
              <h2 className="font-bold text-lg">Walmart</h2>
              <p className="text-xs opacity-90">Analytics Hub</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="hover:bg-walmart-blue/10 data-[active=true]:bg-walmart-blue data-[active=true]:text-white"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Information</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {infoItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="hover:bg-walmart-blue/10 data-[active=true]:bg-walmart-blue data-[active=true]:text-white"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {user && (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-walmart-blue text-white text-xs">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {state === "expanded" && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
              </div>
            )}
            {state === "expanded" && (
              <Button variant="ghost" size="sm" onClick={logout} className="text-xs">
                Logout
              </Button>
            )}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
