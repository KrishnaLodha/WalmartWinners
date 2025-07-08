"""
AI/ML Module for Walmart Analytics Platform
Provides machine learning capabilities for demand forecasting,
customer segmentation, and personalized promotions.
"""

from .data_preprocessing import DataPreprocessor
from .demand_forecasting import DemandForecaster
from .customer_segmentation import CustomerSegmentation
from .personalized_promotions import PromotionEngine

__version__ = "1.0.0"
__author__ = "Walmart Analytics Team"

__all__ = [
    'DataPreprocessor',
    'DemandForecaster', 
    'CustomerSegmentation',
    'PromotionEngine'
]
