"""
Model training pipeline for automated ML model updates
Handles scheduled retraining and model performance monitoring
"""

import schedule
import time
import logging
from datetime import datetime
from data_preprocessing import DataPreprocessor
from demand_forecasting import DemandForecaster
from customer_segmentation import CustomerSegmentation

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('model_training.log'),
        logging.StreamHandler()
    ]
)

class ModelTrainingPipeline:
    def __init__(self):
        self.preprocessor = DataPreprocessor()
        self.demand_forecaster = DemandForecaster()
        self.customer_segmentation = CustomerSegmentation()
        
    def retrain_demand_models(self):
        """Retrain demand forecasting models with latest data"""
        try:
            logging.info("Starting demand model retraining...")
            
            # Load and preprocess data
            self.preprocessor.load_data_from_db()
            clean_data = self.preprocessor.clean_sales_data()
            
            # Get unique products
            products = clean_data['product_id'].unique()
            
            for product_id in products:
                logging.info(f"Training model for product {product_id}")
                
                # Prepare data for this product
                product_data = self.preprocessor.prepare_forecast_data(product_id)
                
                if product_data is not None and len(product_data) > 30:
                    X, y = self.demand_forecaster.prepare_features(product_data)
                    
                    if len(X) > 10:  # Minimum data requirement
                        self.demand_forecaster.train_models(X, y)
                        
                        # Save model
                        model_path = f"models/demand_model_product_{product_id}.joblib"
                        self.demand_forecaster.save_model(model_path)
                        
                        logging.info(f"Model saved for product {product_id}")
            
            logging.info("Demand model retraining completed successfully")
            
        except Exception as e:
            logging.error(f"Error in demand model retraining: {str(e)}")
    
    def update_customer_segments(self):
        """Update customer segmentation with latest data"""
        try:
            logging.info("Starting customer segmentation update...")
            
            # Load latest customer data
            self.customer_segmentation.load_customer_data()
            
            # Perform clustering
            cluster_labels, analysis = self.customer_segmentation.perform_kmeans_clustering()
            
            # Assign segment names
            segment_names = self.customer_segmentation.assign_segment_names()
            
            logging.info(f"Customer segmentation updated. Found {len(segment_names)} segments")
            logging.info("Customer segmentation update completed successfully")
            
        except Exception as e:
            logging.error(f"Error in customer segmentation update: {str(e)}")
    
    def run_full_pipeline(self):
        """Run the complete model training pipeline"""
        logging.info("Starting full model training pipeline...")
        
        start_time = datetime.now()
        
        # Retrain demand models
        self.retrain_demand_models()
        
        # Update customer segments
        self.update_customer_segments()
        
        end_time = datetime.now()
        duration = end_time - start_time
        
        logging.info(f"Full pipeline completed in {duration}")

def schedule_model_training():
    """Schedule automated model training"""
    pipeline = ModelTrainingPipeline()
    
    # Schedule daily demand model updates
    schedule.every().day.at("02:00").do(pipeline.retrain_demand_models)
    
    # Schedule weekly customer segmentation updates
    schedule.every().sunday.at("03:00").do(pipeline.update_customer_segments)
    
    # Schedule monthly full pipeline run
    schedule.every().month.do(pipeline.run_full_pipeline)
    
    logging.info("Model training scheduled:")
    logging.info("- Daily demand model retraining at 2:00 AM")
    logging.info("- Weekly customer segmentation at 3:00 AM on Sundays")
    logging.info("- Monthly full pipeline run")
    
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    # For manual execution
    pipeline = ModelTrainingPipeline()
    pipeline.run_full_pipeline()
