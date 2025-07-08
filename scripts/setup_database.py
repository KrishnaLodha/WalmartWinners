"""
Database setup script for Walmart Analytics Platform
Creates tables for inventory, sales, customers, and forecasts
"""

import sqlite3
from datetime import datetime, timedelta
import random

def create_database():
    conn = sqlite3.connect('walmart_analytics.db')
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            sku TEXT UNIQUE NOT NULL,
            category TEXT NOT NULL,
            current_stock INTEGER NOT NULL,
            optimal_stock INTEGER NOT NULL,
            reorder_point INTEGER NOT NULL,
            price REAL NOT NULL,
            cost REAL NOT NULL,
            supplier_id TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            quantity INTEGER NOT NULL,
            unit_price REAL NOT NULL,
            total_amount REAL NOT NULL,
            customer_id INTEGER,
            store_id TEXT,
            sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES inventory (id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            segment TEXT,
            total_spent REAL DEFAULT 0,
            order_count INTEGER DEFAULT 0,
            last_purchase TIMESTAMP,
            loyalty_points INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS demand_forecasts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            forecast_date DATE NOT NULL,
            predicted_demand INTEGER NOT NULL,
            confidence_score REAL,
            actual_demand INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES inventory (id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS promotions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            discount_value REAL NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            target_segment TEXT,
            status TEXT DEFAULT 'draft',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            severity TEXT NOT NULL,
            message TEXT NOT NULL,
            product_id INTEGER,
            is_resolved BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            resolved_at TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES inventory (id)
        )
    ''')
    
    conn.commit()
    print("Database tables created successfully!")
    
    # Seed with sample data
    seed_sample_data(cursor, conn)
    
    conn.close()

def seed_sample_data(cursor, conn):
    """Seed database with sample data"""
    
    # Sample inventory data
    inventory_data = [
        ('iPhone 15 Pro', 'APPL-IP15P-128', 'Electronics', 5, 50, 10, 999.99, 750.00, 'APPLE-001'),
        ('Samsung 55" QLED TV', 'SAMS-Q55-2024', 'Electronics', 25, 30, 8, 1299.99, 950.00, 'SAMSUNG-001'),
        ('Nike Air Max 270', 'NIKE-AM270-BLK', 'Footwear', 3, 40, 12, 149.99, 90.00, 'NIKE-001'),
        ('Winter Jacket - XL', 'CLTH-WJ-XL-BLU', 'Clothing', 85, 35, 15, 89.99, 45.00, 'CLOTHING-001'),
        ('MacBook Pro 14"', 'APPL-MBP14-M3', 'Electronics', 8, 20, 5, 1999.99, 1500.00, 'APPLE-001'),
        ('Wireless Headphones', 'SONY-WH1000XM5', 'Electronics', 15, 25, 8, 349.99, 200.00, 'SONY-001'),
        ('Running Shoes', 'ADIDAS-ULTRA-22', 'Footwear', 22, 30, 10, 179.99, 110.00, 'ADIDAS-001'),
        ('Coffee Maker', 'KEURIG-K-ELITE', 'Home', 12, 20, 6, 199.99, 120.00, 'KEURIG-001')
    ]
    
    cursor.executemany('''
        INSERT INTO inventory (name, sku, category, current_stock, optimal_stock, reorder_point, price, cost, supplier_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', inventory_data)
    
    # Sample customer data
    customer_data = [
        ('John Smith', 'john.smith@email.com', '+1-555-0101', 'high_value', 2450.00, 12, '2024-01-14', 1250),
        ('Sarah Johnson', 'sarah.j@email.com', '+1-555-0102', 'frequent_buyer', 890.50, 8, '2024-01-13', 445),
        ('Mike Wilson', 'mike.w@email.com', '+1-555-0103', 'regular', 345.75, 3, '2024-01-10', 172),
        ('Emily Davis', 'emily.d@email.com', '+1-555-0104', 'new_customer', 125.99, 1, '2024-01-15', 62),
        ('Robert Brown', 'robert.b@email.com', '+1-555-0105', 'high_value', 3200.00, 18, '2024-01-12', 1600)
    ]
    
    cursor.executemany('''
        INSERT INTO customers (name, email, phone, segment, total_spent, order_count, last_purchase, loyalty_points)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', customer_data)
    
    # Generate sample sales data for the last 30 days
    base_date = datetime.now() - timedelta(days=30)
    sales_data = []
    
    for i in range(200):  # Generate 200 sample sales
        sale_date = base_date + timedelta(days=random.randint(0, 30))
        product_id = random.randint(1, 8)
        quantity = random.randint(1, 5)
        unit_price = random.uniform(50, 2000)
        total_amount = quantity * unit_price
        customer_id = random.randint(1, 5)
        store_id = f"STORE-{random.randint(1, 5):03d}"
        
        sales_data.append((product_id, quantity, unit_price, total_amount, customer_id, store_id, sale_date))
    
    cursor.executemany('''
        INSERT INTO sales (product_id, quantity, unit_price, total_amount, customer_id, store_id, sale_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', sales_data)
    
    # Sample alerts
    alerts_data = [
        ('low_stock', 'critical', 'iPhone 15 Pro - Only 5 units left', 1, False),
        ('overstock', 'medium', 'Winter Jackets - 150% above optimal level', 4, False),
        ('price_change', 'info', 'MacBook Pro price updated', 5, True),
        ('low_stock', 'high', 'Nike Air Max - Below reorder point', 3, False)
    ]
    
    cursor.executemany('''
        INSERT INTO alerts (type, severity, message, product_id, is_resolved)
        VALUES (?, ?, ?, ?, ?)
    ''', alerts_data)
    
    conn.commit()
    print("Sample data seeded successfully!")

if __name__ == "__main__":
    create_database()
