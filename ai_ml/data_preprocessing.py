"""
Data preprocessing module for Walmart Analytics Platform
Handles data cleaning, feature engineering, and preparation for ML models
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
import sqlite3

class DataPreprocessor:
    def __init__(self, db_path='walmart_analytics.db'):
        self.db_path = db_path
        self.scaler = StandardScaler()
        self.label_encoders = {}
        
    def load_data_from_db(self):
        """Load data from SQLite database"""
        conn = sqlite3.connect(self.db_path)
        
        # Load sales data with product information
        sales_query = '''
            SELECT s.*, i.name, i.category, i.price, i.cost
            FROM sales s
            JOIN inventory i ON s.product_id = i.id
            ORDER BY s.sale_date
        '''
        self.sales_df = pd.read_sql_query(sales_query, conn)
        
        # Load inventory data
        inventory_query = 'SELECT * FROM inventory'
        self.inventory_df = pd.read_sql_query(inventory_query, conn)
        
        # Load customer data
        customer_query = 'SELECT * FROM customers'
        self.customers_df = pd.read_sql_query(customer_query, conn)
        
        conn.close()
        
    def clean_sales_data(self):
        """Clean and preprocess sales data"""
        # Convert date columns
        self.sales_df['sale_date'] = pd.to_datetime(self.sales_df['sale_date'])
        
        # Handle missing values
        imputer = SimpleImputer(strategy='median')
        numeric_columns = ['quantity', 'unit_price', 'total_amount']
        self.sales_df[numeric_columns] = imputer.fit_transform(self.sales_df[numeric_columns])
        
        # Remove outliers (sales > 99th percentile)
        q99 = self.sales_df['total_amount'].quantile(0.99)
        self.sales_df = self.sales_df[self.sales_df['total_amount'] <= q99]
        
        # Create time-based features
        self.sales_df['year'] = self.sales_df['sale_date'].dt.year
        self.sales_df['month'] = self.sales_df['sale_date'].dt.month
        self.sales_df['day'] = self.sales_df['sale_date'].dt.day
        self.sales_df['weekday'] = self.sales_df['sale_date'].dt.weekday
        self.sales_df['is_weekend'] = self.sales_df['weekday'].isin([5, 6]).astype(int)
        
        return self.sales_df
    
    def create_demand_features(self, product_id=None, days_back=30):
        """Create demand forecasting features"""
        if product_id:
            product_sales = self.sales_df[self.sales_df['product_id'] == product_id].copy()
        else:
            product_sales = self.sales_df.copy()
        
        # Aggregate daily sales
        daily_sales = product_sales.groupby(['product_id', 'sale_date']).agg({
            'quantity': 'sum',
            'total_amount': 'sum'
        }).reset_index()
        
        # Create lag features
        for lag in [1, 7, 14, 30]:
            daily_sales[f'quantity_lag_{lag}'] = daily_sales.groupby('product_id')['quantity'].shift(lag)
            daily_sales[f'amount_lag_{lag}'] = daily_sales.groupby('product_id')['total_amount'].shift(lag)
        
        # Create rolling averages
        for window in [7, 14, 30]:
            daily_sales[f'quantity_ma_{window}'] = daily_sales.groupby('product_id')['quantity'].rolling(window).mean().reset_index(0, drop=True)
            daily_sales[f'amount_ma_{window}'] = daily_sales.groupby('product_id')['total_amount'].rolling(window).mean().reset_index(0, drop=True)
        
        return daily_sales
    
    def encode_categorical_features(self, df, categorical_columns):
        """Encode categorical features"""
        encoded_df = df.copy()
        
        for column in categorical_columns:
            if column not in self.label_encoders:
                self.label_encoders[column] = LabelEncoder()
                encoded_df[column] = self.label_encoders[column].fit_transform(df[column].astype(str))
            else:
                encoded_df[column] = self.label_encoders[column].transform(df[column].astype(str))
        
        return encoded_df
    
    def prepare_forecast_data(self, product_id, forecast_days=7):
        """Prepare data for demand forecasting"""
        # Get historical sales for the product
        product_sales = self.sales_df[self.sales_df['product_id'] == product_id].copy()
        
        if product_sales.empty:
            return None
        
        # Create daily aggregation
        daily_data = product_sales.groupby('sale_date').agg({
            'quantity': 'sum',
            'total_amount': 'sum'
        }).reset_index()
        
        # Sort by date
        daily_data = daily_data.sort_values('sale_date')
        
        # Create features
        daily_data['day_of_week'] = daily_data['sale_date'].dt.dayofweek
        daily_data['month'] = daily_data['sale_date'].dt.month
        daily_data['is_weekend'] = daily_data['day_of_week'].isin([5, 6]).astype(int)
        
        # Create lag features
        for lag in [1, 7, 14]:
            daily_data[f'quantity_lag_{lag}'] = daily_data['quantity'].shift(lag)
        
        # Create rolling features
        daily_data['quantity_ma_7'] = daily_data['quantity'].rolling(7).mean()
        daily_data['quantity_ma_14'] = daily_data['quantity'].rolling(14).mean()
        
        # Remove rows with NaN values
        daily_data = daily_data.dropna()
        
        return daily_data

def main():
    """Example usage of DataPreprocessor"""
    preprocessor = DataPreprocessor()
    preprocessor.load_data_from_db()
    
    # Clean sales data
    clean_sales = preprocessor.clean_sales_data()
    print(f"Cleaned sales data shape: {clean_sales.shape}")
    
    # Create demand features
    demand_features = preprocessor.create_demand_features()
    print(f"Demand features shape: {demand_features.shape}")
    
    # Prepare forecast data for a specific product
    forecast_data = preprocessor.prepare_forecast_data(product_id=1)
    if forecast_data is not None:
        print(f"Forecast data for product 1 shape: {forecast_data.shape}")
    
    print("Data preprocessing completed successfully!")

if __name__ == "__main__":
    main()
