import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://witpbqsrpdkjfjeznztq.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpdHBicXNycGRramZqZXpuenRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwODIyNjUsImV4cCI6MjA2NzY1ODI2NX0.sQzIWgzD_PEfy4iKu4mYhnx6ABUu85YRHXD7rJFbxL4"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Types
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "store_manager" | "analyst"
  store_id?: string
  created_at: string
  updated_at: string
}

export interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  current_stock: number
  max_stock: number
  reorder_point: number
  price: number
  cost: number
  supplier_id?: string
  warehouse_id: string
  warehouse_name?: string
  demand_forecast_7_days: number[]
  avg_daily_sales: number
  lead_time_days: number
  stock_level?: number
  status?: "healthy" | "low" | "critical" | "overstock"
  days_remaining?: number
  total_forecasted_demand?: number
  needs_reorder?: boolean
  created_at: string
  updated_at: string
}

export interface Alert {
  id: string
  type: string
  priority: string
  product_id: string
  product_name: string
  sku: string
  warehouse: string
  title: string
  message: string
  description: string
  action: string
  severity: string
  ml_confidence: number
  status: string
  created_at: string
  resolved_at?: string
}

export interface RedistributionLog {
  id: string
  sku: string
  product_name: string
  from_warehouse_id: string
  to_warehouse_id: string
  transfer_quantity: number
  transport_cost: number
  estimated_savings: number
  roi: number
  priority: string
  status: string
  initiated_by?: string
  created_at: string
  completed_at?: string
}

export interface Warehouse {
  id: string
  name: string
  location: string
  capacity: number
  current_utilization: number
  created_at: string
  updated_at: string
}
