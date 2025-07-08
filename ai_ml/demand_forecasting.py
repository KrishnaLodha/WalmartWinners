"""
Demand forecasting models for Walmart Analytics Platform
Implements various ML models for predicting product demand
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split, TimeSeriesSplit
import xgboost as xgb
import joblib
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class DemandForecaster:
    def __init__(self):
        self.models = {
            'linear_regression': LinearRegression(),
            'random_forest': RandomForestRegressor(n_estimators=100, random_state=42),
            'gradient_boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
            'xgboost': xgb.XGBRegressor(n_estimators=100, random_state=42)
        }
        self.best_model = None
        self.feature_importance = None
        
    def prepare_features(self, data):
        """Prepare features for model training"""
        feature_columns = [
            'day_of_week', 'month', 'is_weekend',
            'quantity_lag_1', 'quantity_lag_7', 'quantity_lag_14',
            'quantity_ma_7', 'quantity_ma_14'
        ]
        
        # Select only available columns
        available_columns = [col for col in feature_columns if col in data.columns]
        
        X = data[available_columns]
        y = data['quantity']
        
        return X, y
    
    def train_models(self, X, y):
        """Train multiple models and select the best one"""
        # Use time series split for validation
        tscv = TimeSeriesSplit(n_splits=3)
        model_scores = {}
        
        for name, model in self.models.items():
            scores = []
            
            for train_idx, val_idx in tscv.split(X):
                X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
                y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]
                
                # Handle missing values
                X_train = X_train.fillna(X_train.mean())
                X_val = X_val.fillna(X_train.mean())
                
                model.fit(X_train, y_train)
                y_pred = model.predict(X_val)
                
                mae = mean_absolute_error(y_val, y_pred)
                scores.append(mae)
            
            model_scores[name] = np.mean(scores)
            print(f"{name}: Average MAE = {np.mean(scores):.2f}")
        
        # Select best model
        best_model_name = min(model_scores, key=model_scores.get)
        self.best_model = self.models[best_model_name]
        
        # Train best model on full dataset
        X_clean = X.fillna(X.mean())
        self.best_model.fit(X_clean, y)
        
        # Get feature importance if available
        if hasattr(self.best_model, 'feature_importances_'):
            self.feature_importance = dict(zip(X.columns, self.best_model.feature_importances_))
        
        print(f"Best model: {best_model_name}")
        return best_model_name, model_scores[best_model_name]
    
    def predict(self, X):
        """Make predictions using the best model"""
        if self.best_model is None:
            raise ValueError("Model not trained yet. Call train_models first.")
        
        X_clean = X.fillna(X.mean())
        predictions = self.best_model.predict(X_clean)
        
        # Ensure predictions are non-negative
        predictions = np.maximum(predictions, 0)
        
        return predictions
    
    def forecast_future_demand(self, historical_data, days_ahead=7):
        """Forecast demand for future days"""
        if self.best_model is None:
            raise ValueError("Model not trained yet.")
        
        forecasts = []
        last_date = historical_data['sale_date'].max()
        
        # Get the last known values for creating features
        last_row = historical_data.iloc[-1].copy()
        
        for day in range(1, days_ahead + 1):
            future_date = last_date + timedelta(days=day)
            
            # Create features for future date
            future_features = {
                'day_of_week': future_date.weekday(),
                'month': future_date.month,
                'is_weekend': 1 if future_date.weekday() in [5, 6] else 0,
            }
            
            # Use last known values for lag features (simplified approach)
            if len(forecasts) > 0:
                future_features['quantity_lag_1'] = forecasts[-1]
            else:
                future_features['quantity_lag_1'] = last_row.get('quantity', 0)
            
            future_features['quantity_lag_7'] = last_row.get('quantity_lag_7', 0)
            future_features['quantity_lag_14'] = last_row.get('quantity_lag_14', 0)
            future_features['quantity_ma_7'] = last_row.get('quantity_ma_7', 0)
            future_features['quantity_ma_14'] = last_row.get('quantity_ma_14', 0)
            
            # Create DataFrame for prediction
            future_df = pd.DataFrame([future_features])
            
            # Make prediction
            prediction = self.predict(future_df)[0]
            forecasts.append(prediction)
        
        return forecasts
    
    def save_model(self, filepath):
        """Save the trained model"""
        if self.best_model is None:
            raise ValueError("No model to save. Train a model first.")
        
        joblib.dump({
            'model': self.best_model,
            'feature_importance': self.feature_importance
        }, filepath)
    
    def load_model(self, filepath):
        """Load a trained model"""
        model_data = joblib.load(filepath)
        self.best_model = model_data['model']
        self.feature_importance = model_data.get('feature_importance')

def evaluate_model_performance(y_true, y_pred):
    """Evaluate model performance"""
    mae = mean_absolute_error(y_true, y_pred)
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_true, y_pred)
    
    return {
        'MAE': mae,
        'MSE': mse,
        'RMSE': rmse,
        'R2': r2
    }

def main():
    """Example usage of DemandForecaster"""
    # This would typically load data from the preprocessor
    print("Demand Forecasting Module")
    print("This module provides ML-based demand forecasting capabilities")
    print("Key features:")
    print("- Multiple ML algorithms (Linear Regression, Random Forest, Gradient Boosting, XGBoost)")
    print("- Time series cross-validation")
    print("- Feature importance analysis")
    print("- Future demand prediction")
    print("- Model persistence")

if __name__ == "__main__":
    main()
