"""
Advanced Inventory Optimization with AI/ML
Implements demand forecasting, warehouse redistribution, and alert systems
"""

import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
from datetime import datetime, timedelta
import joblib
import warnings
warnings.filterwarnings('ignore')

class InventoryOptimizer:
    def __init__(self):
        self.demand_forecaster = RandomForestRegressor(n_estimators=100, random_state=42)
        self.warehouse_clusterer = KMeans(n_clusters=3, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        
    def prepare_demand_features(self, historical_data):
        """Prepare features for demand forecasting"""
        features = []
        
        for _, row in historical_data.iterrows():
            # Time-based features
            date = pd.to_datetime(row['date'])
            day_of_week = date.weekday()
            month = date.month
            is_weekend = 1 if day_of_week >= 5 else 0
            
            # Lag features (previous days' sales)
            lag_1 = row.get('sales_lag_1', 0)
            lag_7 = row.get('sales_lag_7', 0)
            lag_30 = row.get('sales_lag_30', 0)
            
            # Moving averages
            ma_7 = row.get('sales_ma_7', 0)
            ma_30 = row.get('sales_ma_30', 0)
            
            # External factors
            is_holiday = row.get('is_holiday', 0)
            weather_score = row.get('weather_score', 0.5)  # 0-1 scale
            promotion_active = row.get('promotion_active', 0)
            
            # Product features
            price = row.get('price', 0)
            category_encoded = row.get('category_encoded', 0)
            
            feature_vector = [
                day_of_week, month, is_weekend,
                lag_1, lag_7, lag_30,
                ma_7, ma_30,
                is_holiday, weather_score, promotion_active,
                price, category_encoded
            ]
            
            features.append(feature_vector)
        
        return np.array(features)
    
    def train_demand_forecaster(self, historical_data):
        """Train the demand forecasting model"""
        print("Training demand forecasting model...")
        
        # Prepare features and targets
        X = self.prepare_demand_features(historical_data)
        y = historical_data['actual_sales'].values
        
        # Train the model
        self.demand_forecaster.fit(X, y)
        
        # Calculate accuracy
        predictions = self.demand_forecaster.predict(X)
        mae = mean_absolute_error(y, predictions)
        accuracy = 1 - (mae / np.mean(y))
        
        print(f"Demand forecasting model trained. Accuracy: {accuracy:.2%}")
        self.is_trained = True
        
        return accuracy
    
    def forecast_demand(self, product_data, days_ahead=7):
        """Forecast demand for a product"""
        if not self.is_trained:
            raise ValueError("Model not trained. Call train_demand_forecaster first.")
        
        forecasts = []
        
        for day in range(days_ahead):
            future_date = datetime.now() + timedelta(days=day+1)
            
            # Create feature vector for future date
            feature_vector = [
                future_date.weekday(),  # day_of_week
                future_date.month,      # month
                1 if future_date.weekday() >= 5 else 0,  # is_weekend
                product_data.get('recent_sales', [0])[-1] if product_data.get('recent_sales') else 0,  # lag_1
                product_data.get('sales_7_days_ago', 0),   # lag_7
                product_data.get('sales_30_days_ago', 0),  # lag_30
                product_data.get('avg_sales_7d', 0),       # ma_7
                product_data.get('avg_sales_30d', 0),      # ma_30
                product_data.get('is_holiday', 0),         # is_holiday
                product_data.get('weather_score', 0.5),    # weather_score
                product_data.get('promotion_active', 0),   # promotion_active
                product_data.get('price', 0),              # price
                product_data.get('category_encoded', 0)    # category_encoded
            ]
            
            # Predict demand
            demand = self.demand_forecaster.predict([feature_vector])[0]
            forecasts.append(max(0, round(demand)))  # Ensure non-negative integer
        
        return forecasts
    
    def analyze_warehouse_redistribution(self, warehouse_data):
        """Analyze warehouse data for redistribution opportunities"""
        print("Analyzing warehouse redistribution opportunities...")
        
        # Prepare warehouse features for clustering
        features = []
        warehouse_info = []
        
        for warehouse in warehouse_data:
            # Calculate warehouse metrics
            total_inventory = sum(item['current_stock'] for item in warehouse['inventory'])
            total_capacity = warehouse['capacity']
            utilization = total_inventory / total_capacity
            
            avg_demand = np.mean([
                sum(item.get('demand_forecast_7d', [0])) 
                for item in warehouse['inventory']
            ])
            
            distance_to_major_city = warehouse.get('distance_to_major_city', 0)
            shipping_cost_factor = warehouse.get('shipping_cost_factor', 1.0)
            
            # Feature vector for clustering
            feature_vector = [
                utilization,
                avg_demand,
                distance_to_major_city,
                shipping_cost_factor,
                len(warehouse['inventory'])  # number of SKUs
            ]
            
            features.append(feature_vector)
            warehouse_info.append({
                'id': warehouse['id'],
                'name': warehouse['name'],
                'utilization': utilization,
                'avg_demand': avg_demand,
                'total_inventory': total_inventory,
                'capacity': total_capacity
            })
        
        # Normalize features
        features_scaled = self.scaler.fit_transform(features)
        
        # Perform clustering
        clusters = self.warehouse_clusterer.fit_predict(features_scaled)
        
        # Analyze clusters and generate redistribution suggestions
        redistribution_suggestions = []
        
        for i, cluster in enumerate(clusters):
            warehouse_info[i]['cluster'] = cluster
        
        # Group warehouses by cluster
        cluster_groups = {}
        for info in warehouse_info:
            cluster = info['cluster']
            if cluster not in cluster_groups:
                cluster_groups[cluster] = []
            cluster_groups[cluster].append(info)
        
        # Find redistribution opportunities
        for cluster_id, warehouses in cluster_groups.items():
            if len(warehouses) < 2:
                continue
                
            # Sort by utilization
            warehouses.sort(key=lambda x: x['utilization'])
            
            underutilized = [w for w in warehouses if w['utilization'] < 0.6]
            overutilized = [w for w in warehouses if w['utilization'] > 0.9]
            
            # Generate redistribution suggestions
            for over_wh in overutilized:
                for under_wh in underutilized:
                    if over_wh['id'] != under_wh['id']:
                        # Calculate potential transfer
                        excess_capacity = (over_wh['utilization'] - 0.8) * over_wh['capacity']
                        available_capacity = (0.8 - under_wh['utilization']) * under_wh['capacity']
                        transfer_amount = min(excess_capacity, available_capacity)
                        
                        if transfer_amount > 0:
                            redistribution_suggestions.append({
                                'from_warehouse': over_wh['name'],
                                'to_warehouse': under_wh['name'],
                                'transfer_amount': round(transfer_amount),
                                'priority': 'high' if over_wh['utilization'] > 0.95 else 'medium',
                                'estimated_cost': transfer_amount * 10,  # $10 per unit
                                'estimated_savings': transfer_amount * 15,  # $15 savings per unit
                                'roi': ((transfer_amount * 15) - (transfer_amount * 10)) / (transfer_amount * 10) * 100
                            })
        
        return {
            'redistribution_suggestions': redistribution_suggestions,
            'warehouse_clusters': cluster_groups,
            'optimization_score': len(redistribution_suggestions)
        }
    
    def generate_inventory_alerts(self, inventory_data):
        """Generate ML-based inventory alerts"""
        alerts = []
        
        for item in inventory_data:
            current_stock = item['current_stock']
            max_stock = item['max_stock']
            demand_forecast = item.get('demand_forecast_7d', [0] * 7)
            
            # Calculate key metrics
            total_forecasted_demand = sum(demand_forecast)
            stock_level = (current_stock / max_stock) * 100
            days_remaining = current_stock / (total_forecasted_demand / 7) if total_forecasted_demand > 0 else float('inf')
            
            # Critical Alert: Stock will run out soon
            if days_remaining < 3:
                alerts.append({
                    'type': 'critical',
                    'priority': 'high',
                    'product_id': item['id'],
                    'product_name': item['name'],
                    'message': f"Critical: {item['name']} will run out in {days_remaining:.1f} days",
                    'days_remaining': days_remaining,
                    'recommended_action': 'urgent_reorder',
                    'confidence': 0.95
                })
            
            # Low Stock Alert
            elif days_remaining < 7:
                alerts.append({
                    'type': 'low_stock',
                    'priority': 'medium',
                    'product_id': item['id'],
                    'product_name': item['name'],
                    'message': f"Low stock: {item['name']} needs reorder in {days_remaining:.1f} days",
                    'days_remaining': days_remaining,
                    'recommended_action': 'schedule_reorder',
                    'confidence': 0.87
                })
            
            # Overstock Alert
            elif total_forecasted_demand < current_stock * 0.3 and days_remaining > 30:
                alerts.append({
                    'type': 'overstock',
                    'priority': 'low',
                    'product_id': item['id'],
                    'product_name': item['name'],
                    'message': f"Overstock: {item['name']} has {days_remaining:.0f} days of inventory",
                    'excess_days': days_remaining - 30,
                    'recommended_action': 'promote_or_redistribute',
                    'confidence': 0.82
                })
        
        return sorted(alerts, key=lambda x: x['confidence'], reverse=True)
    
    def optimize_reorder_quantities(self, product_data):
        """Calculate optimal reorder quantities using EOQ model"""
        optimized_orders = []
        
        for product in product_data:
            # Economic Order Quantity (EOQ) calculation
            annual_demand = product.get('annual_demand', 0)
            ordering_cost = product.get('ordering_cost', 50)  # Cost per order
            holding_cost = product.get('holding_cost_per_unit', 5)  # Annual holding cost per unit
            
            if annual_demand > 0 and holding_cost > 0:
                eoq = np.sqrt((2 * annual_demand * ordering_cost) / holding_cost)
                
                # Adjust for lead time and safety stock
                lead_time_days = product.get('lead_time_days', 7)
                daily_demand = annual_demand / 365
                lead_time_demand = daily_demand * lead_time_days
                safety_stock = daily_demand * 7  # 1 week safety stock
                
                reorder_point = lead_time_demand + safety_stock
                optimal_quantity = max(eoq, product['max_stock'] - product['current_stock'])
                
                optimized_orders.append({
                    'product_id': product['id'],
                    'product_name': product['name'],
                    'current_stock': product['current_stock'],
                    'reorder_point': round(reorder_point),
                    'optimal_quantity': round(optimal_quantity),
                    'eoq': round(eoq),
                    'safety_stock': round(safety_stock),
                    'total_cost': optimal_quantity * product.get('unit_cost', 0),
                    'urgency': 'high' if product['current_stock'] <= reorder_point else 'normal'
                })
        
        return optimized_orders
    
    def save_models(self, filepath_prefix):
        """Save trained models"""
        joblib.dump(self.demand_forecaster, f"{filepath_prefix}_demand_forecaster.joblib")
        joblib.dump(self.warehouse_clusterer, f"{filepath_prefix}_warehouse_clusterer.joblib")
        joblib.dump(self.scaler, f"{filepath_prefix}_scaler.joblib")
        print(f"Models saved with prefix: {filepath_prefix}")
    
    def load_models(self, filepath_prefix):
        """Load trained models"""
        self.demand_forecaster = joblib.load(f"{filepath_prefix}_demand_forecaster.joblib")
        self.warehouse_clusterer = joblib.load(f"{filepath_prefix}_warehouse_clusterer.joblib")
        self.scaler = joblib.load(f"{filepath_prefix}_scaler.joblib")
        self.is_trained = True
        print(f"Models loaded from prefix: {filepath_prefix}")

def main():
    """Example usage of InventoryOptimizer"""
    print("Inventory Optimization System")
    print("=" * 50)
    
    # Initialize optimizer
    optimizer = InventoryOptimizer()
    
    # Example historical data for training
    historical_data = pd.DataFrame({
        'date': pd.date_range('2023-01-01', periods=365),
        'actual_sales': np.random.poisson(5, 365),  # Poisson distribution for sales
        'sales_lag_1': np.random.poisson(5, 365),
        'sales_lag_7': np.random.poisson(5, 365),
        'sales_lag_30': np.random.poisson(5, 365),
        'sales_ma_7': np.random.normal(5, 1, 365),
        'sales_ma_30': np.random.normal(5, 1, 365),
        'is_holiday': np.random.binomial(1, 0.1, 365),
        'weather_score': np.random.uniform(0, 1, 365),
        'promotion_active': np.random.binomial(1, 0.2, 365),
        'price': np.random.normal(100, 10, 365),
        'category_encoded': np.random.randint(0, 5, 365)
    })
    
    # Train the demand forecaster
    accuracy = optimizer.train_demand_forecaster(historical_data)
    
    # Example product data for forecasting
    product_data = {
        'recent_sales': [4, 5, 3, 6, 4],
        'sales_7_days_ago': 4,
        'sales_30_days_ago': 5,
        'avg_sales_7d': 4.5,
        'avg_sales_30d': 4.8,
        'is_holiday': 0,
        'weather_score': 0.7,
        'promotion_active': 0,
        'price': 99.99,
        'category_encoded': 1
    }
    
    # Forecast demand
    forecast = optimizer.forecast_demand(product_data, days_ahead=7)
    print(f"\n7-day demand forecast: {forecast}")
    
    # Example warehouse data
    warehouse_data = [
        {
            'id': 'WH-001',
            'name': 'Mumbai Central',
            'capacity': 10000,
            'distance_to_major_city': 0,
            'shipping_cost_factor': 1.0,
            'inventory': [
                {'current_stock': 50, 'demand_forecast_7d': [4, 5, 6, 3, 2, 4, 5]},
                {'current_stock': 30, 'demand_forecast_7d': [2, 3, 2, 1, 2, 3, 2]}
            ]
        },
        {
            'id': 'WH-002',
            'name': 'Delhi NCR',
            'capacity': 8000,
            'distance_to_major_city': 50,
            'shipping_cost_factor': 1.2,
            'inventory': [
                {'current_stock': 20, 'demand_forecast_7d': [3, 4, 2, 3, 4, 3, 2]},
                {'current_stock': 100, 'demand_forecast_7d': [1, 2, 1, 0, 1, 2, 1]}
            ]
        }
    ]
    
    # Analyze redistribution
    redistribution_analysis = optimizer.analyze_warehouse_redistribution(warehouse_data)
    print(f"\nRedistribution suggestions: {len(redistribution_analysis['redistribution_suggestions'])}")
    
    # Example inventory data for alerts
    inventory_data = [
        {
            'id': '1',
            'name': 'iPhone 15 Pro',
            'current_stock': 5,
            'max_stock': 50,
            'demand_forecast_7d': [4, 5, 6, 3, 2, 4, 5]
        },
        {
            'id': '2',
            'name': 'Winter Jacket',
            'current_stock': 85,
            'max_stock': 35,
            'demand_forecast_7d': [1, 2, 1, 0, 1, 2, 1]
        }
    ]
    
    # Generate alerts
    alerts = optimizer.generate_inventory_alerts(inventory_data)
    print(f"\nGenerated {len(alerts)} alerts")
    
    for alert in alerts:
        print(f"- {alert['type'].upper()}: {alert['message']}")

if __name__ == "__main__":
    main()
