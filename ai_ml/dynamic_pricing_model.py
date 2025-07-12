"""
Dynamic Pricing Model for Walmart Analytics Platform
Uses machine learning to optimize product pricing based on overstock levels
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
from datetime import datetime, timedelta

class DynamicPricingModel:
    def __init__(self):
        self.models = {
            'linear_regression': LinearRegression(),
            'random_forest': RandomForestRegressor(n_estimators=100, random_state=42),
            'gradient_boosting': GradientBoostingRegressor(n_estimators=100, random_state=42)
        }
        self.best_model = None
        self.feature_columns = [
            'original_price', 'overstock_percentage', 'category_encoded',
            'sales_velocity', 'days_since_last_sale', 'season_encoded'
        ]
        
    def prepare_training_data(self):
        """Generate synthetic training data for the pricing model"""
        np.random.seed(42)
        n_samples = 1000
        
        # Generate synthetic features
        data = {
            'original_price': np.random.uniform(10, 1000, n_samples),
            'overstock_percentage': np.random.uniform(50, 300, n_samples),
            'category_encoded': np.random.randint(0, 5, n_samples),  # 5 categories
            'sales_velocity': np.random.uniform(0.1, 10, n_samples),
            'days_since_last_sale': np.random.randint(1, 30, n_samples),
            'season_encoded': np.random.randint(0, 4, n_samples)  # 4 seasons
        }
        
        df = pd.DataFrame(data)
        
        # Generate target variable (optimal discount percentage)
        # Higher overstock = higher discount
        # Lower sales velocity = higher discount
        # Category affects discount sensitivity
        
        base_discount = (df['overstock_percentage'] - 100) / 10  # Base discount from overstock
        velocity_adjustment = (10 - df['sales_velocity']) * 2  # Low velocity increases discount
        category_adjustment = df['category_encoded'] * 2  # Category effect
        
        df['optimal_discount'] = np.clip(
            base_discount + velocity_adjustment + category_adjustment + np.random.normal(0, 2, n_samples),
            0, 50  # Discount between 0% and 50%
        )
        
        return df
    
    def train_models(self):
        """Train multiple models and select the best one"""
        # Prepare training data
        df = self.prepare_training_data()
        
        X = df[self.feature_columns]
        y = df['optimal_discount']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model_scores = {}
        
        # Train and evaluate each model
        for name, model in self.models.items():
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            
            mae = mean_absolute_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            model_scores[name] = {'mae': mae, 'r2': r2}
            print(f"{name}: MAE = {mae:.2f}, R2 = {r2:.3f}")
        
        # Select best model (lowest MAE)
        best_model_name = min(model_scores, key=lambda x: model_scores[x]['mae'])
        self.best_model = self.models[best_model_name]
        
        print(f"Best model: {best_model_name}")
        return best_model_name, model_scores
    
    def predict_optimal_discount(self, product_data):
        """Predict optimal discount for a product"""
        if self.best_model is None:
            raise ValueError("Model not trained yet. Call train_models first.")
        
        # Prepare features
        features = np.array([[
            product_data['original_price'],
            product_data['overstock_percentage'],
            product_data.get('category_encoded', 0),
            product_data.get('sales_velocity', 5.0),
            product_data.get('days_since_last_sale', 7),
            product_data.get('season_encoded', 0)
        ]])
        
        discount = self.best_model.predict(features)[0]
        
        # Apply business rules
        discount = max(0, min(discount, 50))  # Cap between 0% and 50%
        
        # Round to nearest 5%
        discount = round(discount / 5) * 5
        
        return discount
    
    def calculate_dynamic_price(self, original_price, optimal_discount):
        """Calculate the dynamic price based on optimal discount"""
        dynamic_price = original_price * (1 - optimal_discount / 100)
        return round(dynamic_price, 2)
    
    def get_pricing_recommendations(self, products_data):
        """Get pricing recommendations for multiple products"""
        recommendations = []
        
        for product in products_data:
            try:
                optimal_discount = self.predict_optimal_discount(product)
                dynamic_price = self.calculate_dynamic_price(product['original_price'], optimal_discount)
                
                recommendation = {
                    'product_id': product.get('id'),
                    'product_name': product.get('name'),
                    'original_price': product['original_price'],
                    'optimal_discount': optimal_discount,
                    'dynamic_price': dynamic_price,
                    'expected_impact': self._estimate_sales_impact(optimal_discount),
                    'confidence': self._calculate_confidence(product)
                }
                
                recommendations.append(recommendation)
                
            except Exception as e:
                print(f"Error processing product {product.get('name', 'Unknown')}: {e}")
                continue
        
        return recommendations
    
    def _estimate_sales_impact(self, discount):
        """Estimate sales impact based on discount percentage"""
        # Simple heuristic: higher discount = higher sales boost
        if discount >= 25:
            return "High (30-50% sales increase)"
        elif discount >= 15:
            return "Medium (15-30% sales increase)"
        elif discount >= 5:
            return "Low (5-15% sales increase)"
        else:
            return "Minimal (0-5% sales increase)"
    
    def _calculate_confidence(self, product_data):
        """Calculate confidence score for the recommendation"""
        # Higher confidence for products with more data
        base_confidence = 0.7
        
        # Adjust based on data quality
        if product_data.get('sales_velocity', 0) > 0:
            base_confidence += 0.1
        
        if product_data.get('overstock_percentage', 0) > 120:
            base_confidence += 0.1  # More confident about overstocked items
        
        return min(base_confidence, 0.95)
    
    def save_model(self, filepath):
        """Save the trained model"""
        if self.best_model is None:
            raise ValueError("No model to save. Train a model first.")
        
        joblib.dump({
            'model': self.best_model,
            'feature_columns': self.feature_columns
        }, filepath)
    
    def load_model(self, filepath):
        """Load a trained model"""
        model_data = joblib.load(filepath)
        self.best_model = model_data['model']
        self.feature_columns = model_data['feature_columns']

def main():
    """Example usage of DynamicPricingModel"""
    print("Dynamic Pricing Model Training")
    
    # Initialize and train model
    pricing_model = DynamicPricingModel()
    best_model, scores = pricing_model.train_models()
    
    # Example product data
    sample_products = [
        {
            'id': '1',
            'name': 'Winter Jacket',
            'original_price': 89.99,
            'overstock_percentage': 243,
            'category_encoded': 1,  # Clothing
            'sales_velocity': 2.1,
            'days_since_last_sale': 3,
            'season_encoded': 0  # Winter
        },
        {
            'id': '2',
            'name': 'Bluetooth Headphones',
            'original_price': 199.99,
            'overstock_percentage': 150,
            'category_encoded': 0,  # Electronics
            'sales_velocity': 3.4,
            'days_since_last_sale': 5,
            'season_encoded': 1  # Spring
        }
    ]
    
    # Get recommendations
    recommendations = pricing_model.get_pricing_recommendations(sample_products)
    
    print("\nPricing Recommendations:")
    for rec in recommendations:
        print(f"Product: {rec['product_name']}")
        print(f"  Original Price: ${rec['original_price']}")
        print(f"  Recommended Discount: {rec['optimal_discount']}%")
        print(f"  Dynamic Price: ${rec['dynamic_price']}")
        print(f"  Expected Impact: {rec['expected_impact']}")
        print(f"  Confidence: {rec['confidence']:.1%}")
        print()

if __name__ == "__main__":
    main()
