-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS redistribution_logs CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'store_manager', 'analyst')),
    store_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create warehouses table
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 10000,
    current_utilization DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory table
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    current_stock INTEGER NOT NULL DEFAULT 0,
    max_stock INTEGER NOT NULL DEFAULT 1000,
    reorder_point INTEGER NOT NULL DEFAULT 100,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    supplier_id VARCHAR(100),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    demand_forecast_7_days INTEGER[] DEFAULT '{0,0,0,0,0,0,0}',
    lead_time_days INTEGER DEFAULT 7,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    product_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    warehouse VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    description TEXT,
    action VARCHAR(255),
    severity VARCHAR(20) DEFAULT 'info',
    ml_confidence DECIMAL(3,2) DEFAULT 0.0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create redistribution_logs table
CREATE TABLE redistribution_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    from_warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    to_warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    transfer_quantity INTEGER NOT NULL,
    transport_cost DECIMAL(10,2) DEFAULT 0.00,
    estimated_savings DECIMAL(10,2) DEFAULT 0.00,
    roi DECIMAL(8,2) DEFAULT 0.00,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'completed', 'cancelled')),
    initiated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Insert sample warehouses
INSERT INTO warehouses (id, name, location, capacity, current_utilization) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Main Distribution Center', 'Mumbai, Maharashtra', 15000, 75.5),
('550e8400-e29b-41d4-a716-446655440002', 'West Coast Hub', 'Pune, Maharashtra', 12000, 68.2),
('550e8400-e29b-41d4-a716-446655440003', 'East Coast Facility', 'Chennai, Tamil Nadu', 10000, 82.1),
('550e8400-e29b-41d4-a716-446655440004', 'Midwest Center', 'Bangalore, Karnataka', 8000, 45.8),
('550e8400-e29b-41d4-a716-446655440005', 'North Hub', 'Delhi NCR', 13000, 71.3)
ON CONFLICT (id) DO NOTHING;

-- Insert sample users
INSERT INTO users (id, email, name, role, store_id) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'admin@walmart.com', 'System Administrator', 'admin', NULL),
('550e8400-e29b-41d4-a716-446655440011', 'manager@walmart.com', 'Store Manager', 'store_manager', 'STORE-001'),
('550e8400-e29b-41d4-a716-446655440012', 'analyst@walmart.com', 'Data Analyst', 'analyst', NULL)
ON CONFLICT (email) DO NOTHING;

-- Insert sample inventory
INSERT INTO inventory (name, sku, category, current_stock, max_stock, reorder_point, price, warehouse_id, demand_forecast_7_days, lead_time_days) VALUES
('iPhone 15 Pro', 'APPL-IP15P-128', 'Electronics', 45, 200, 50, 999.99, '550e8400-e29b-41d4-a716-446655440001', '{8,12,15,10,9,11,13}', 7),
('Samsung Galaxy S24', 'SAMS-GS24-256', 'Electronics', 32, 150, 40, 899.99, '550e8400-e29b-41d4-a716-446655440002', '{6,8,9,7,8,10,9}', 5),
('MacBook Pro 14"', 'APPL-MBP14-M3', 'Electronics', 18, 80, 20, 1999.99, '550e8400-e29b-41d4-a716-446655440003', '{2,3,4,2,3,3,4}', 10),
('Nike Air Max 270', 'NIKE-AM270-BLK', 'Footwear', 85, 300, 75, 149.99, '550e8400-e29b-41d4-a716-446655440004', '{12,15,18,14,16,17,19}', 4),
('Adidas Ultraboost 22', 'ADID-UB22-WHT', 'Footwear', 67, 250, 60, 179.99, '550e8400-e29b-41d4-a716-446655440005', '{8,10,12,9,11,13,10}', 6),
('Sony WH-1000XM5', 'SONY-WH1000XM5', 'Electronics', 124, 200, 50, 399.99, '550e8400-e29b-41d4-a716-446655440001', '{5,7,8,6,7,9,8}', 8),
('Levi''s 501 Jeans', 'LEVI-501-BLU-32', 'Clothing', 156, 400, 100, 89.99, '550e8400-e29b-41d4-a716-446655440002', '{15,18,20,16,19,21,17}', 3),
('Winter Jacket - XL', 'CLTH-WJ-XL-BLK', 'Clothing', 23, 150, 40, 129.99, '550e8400-e29b-41d4-a716-446655440003', '{3,4,5,3,4,6,4}', 5)
ON CONFLICT (sku) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse_id ON inventory(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_sku ON inventory(sku);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_priority ON alerts(priority);
CREATE INDEX IF NOT EXISTS idx_redistribution_logs_created_at ON redistribution_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_redistribution_logs_status ON redistribution_logs(status);

-- Disable Row Level Security for demo purposes
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE redistribution_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses DISABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_inventory_updated_at ON inventory;
DROP TRIGGER IF EXISTS update_warehouses_updated_at ON warehouses;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON warehouses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
