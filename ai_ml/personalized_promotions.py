"""
Personalized promotions engine for Walmart Analytics Platform
Generates targeted offers based on customer segments and behavior
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import sqlite3
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import random

class PromotionEngine:
    def __init__(self, db_path='walmart_analytics.db'):
        self.db_path = db_path
        self.promotion_model = None
        self.customer_preferences = {}
        
    def load_customer_purchase_history(self):
        """Load customer purchase history with product categories"""
        conn = sqlite3.connect(self.db_path)
        
        query = '''
            SELECT 
                s.customer_id,
                s.product_id,
                i.name as product_name,
                i.category,
                i.price,
                s.quantity,
                s.total_amount,
                s.sale_date,
                c.segment
            FROM sales s
            JOIN inventory i ON s.product_id = i.id
            JOIN customers c ON s.customer_id = c.id
            ORDER BY s.sale_date DESC
        '''
        
        self.purchase_history = pd.read_sql_query(query, conn)
        conn.close()
        
        return self.purchase_history
    
    def analyze_customer_preferences(self):
        """Analyze customer preferences by category and price range"""
        if not hasattr(self, 'purchase_history'):
            self.load_customer_purchase_history()
        
        # Calculate preferences by customer
        customer_prefs = self.purchase_history.groupby('customer_id').agg({
            'category': lambda x: x.mode().iloc[0] if not x.empty else 'Unknown',
            'price': ['mean', 'min', 'max'],
            'quantity': 'sum',
            'total_amount': 'sum'
        }).round(2)
        
        # Flatten column names
        customer_prefs.columns = ['_'.join(col).strip() if col[1] else col[0] for col in customer_prefs.columns]
        
        # Calculate category preferences (percentage of purchases per category)
        category_prefs = self.purchase_history.groupby(['customer_id', 'category']).size().unstack(fill_value=0)
        category_prefs = category_prefs.div(category_prefs.sum(axis=1), axis=0) * 100
        
        self.customer_preferences = {
            'general': customer_prefs,
            'categories': category_prefs
        }
        
        return self.customer_preferences
    
    def generate_personalized_offers(self, customer_id, num_offers=3):
        """Generate personalized offers for a specific customer"""
        if not self.customer_preferences:
            self.analyze_customer_preferences()
        
        # Get customer's purchase history
        customer_purchases = self.purchase_history[
            self.purchase_history['customer_id'] == customer_id
        ]
        
        if customer_purchases.empty:
            return self.generate_generic_offers(num_offers)
        
        # Get customer preferences
        customer_segment = customer_purchases['segment'].iloc[0]
        preferred_categories = customer_purchases['category'].value_counts().head(3).index.tolist()
        avg_price = customer_purchases['price'].mean()
        
        offers = []
        
        # Generate category-based offers
        for category in preferred_categories[:num_offers]:
            offer = self.create_category_offer(category, customer_segment, avg_price)
            offers.append(offer)
        
        # Fill remaining slots with cross-category offers
        while len(offers) < num_offers:
            offer = self.create_cross_category_offer(customer_segment, preferred_categories)
            offers.append(offer)
        
        return offers
    
    def create_category_offer(self, category, segment, avg_price):
        """Create an offer for a specific category"""
        # Define discount rates based on customer segment
        segment_discounts = {
            'high_value': (15, 25),
            'frequent_buyer': (10, 20),
            'regular': (5, 15),
            'new_customer': (20, 30),
            'at_risk': (25, 35)
        }
        
        discount_range = segment_discounts.get(segment, (10, 20))
        discount = random.randint(discount_range[0], discount_range[1])
        
        # Create offer based on category
        category_offers = {
            'Electronics': {
                'title': f'{discount}% Off Electronics',
                'description': f'Save {discount}% on all electronics including phones, laptops, and accessories',
                'min_purchase': max(50, avg_price * 0.5),
                'valid_days': 7
            },
            'Clothing': {
                'title': f'{discount}% Off Fashion',
                'description': f'Get {discount}% off on clothing and fashion accessories',
                'min_purchase': max(25, avg_price * 0.3),
                'valid_days': 10
            },
            'Footwear': {
                'title': f'{discount}% Off Shoes',
                'description': f'Step into savings with {discount}% off all footwear',
                'min_purchase': max(30, avg_price * 0.4),
                'valid_days': 14
            },
            'Home': {
                'title': f'{discount}% Off Home & Garden',
                'description': f'Transform your space with {discount}% off home and garden items',
                'min_purchase': max(40, avg_price * 0.6),
                'valid_days': 14
            }
        }
        
        base_offer = category_offers.get(category, {
            'title': f'{discount}% Off {category}',
            'description': f'Save {discount}% on {category.lower()} items',
            'min_purchase': max(25, avg_price * 0.5),
            'valid_days': 7
        })
        
        offer = {
            'type': 'percentage_discount',
            'category': category,
            'discount_value': discount,
            'title': base_offer['title'],
            'description': base_offer['description'],
            'min_purchase_amount': base_offer['min_purchase'],
            'valid_until': (datetime.now() + timedelta(days=base_offer['valid_days'])).strftime('%Y-%m-%d'),
            'segment': segment
        }
        
        return offer
    
    def create_cross_category_offer(self, segment, excluded_categories):
        """Create offers for categories the customer hasn't purchased from"""
        all_categories = ['Electronics', 'Clothing', 'Footwear', 'Home', 'Beauty', 'Sports']
        available_categories = [cat for cat in all_categories if cat not in excluded_categories]
        
        if not available_categories:
            available_categories = all_categories
        
        category = random.choice(available_categories)
        return self.create_category_offer(category, segment, 100)  # Use average price of 100
    
    def generate_generic_offers(self, num_offers=3):
        """Generate generic offers for new customers"""
        generic_offers = [
            {
                'type': 'percentage_discount',
                'category': 'All',
                'discount_value': 20,
                'title': 'Welcome! 20% Off Your First Purchase',
                'description': 'New customer special - save 20% on your first order',
                'min_purchase_amount': 50,
                'valid_until': (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
                'segment': 'new_customer'
            },
            {
                'type': 'free_shipping',
                'category': 'All',
                'discount_value': 0,
                'title': 'Free Shipping on Orders Over $35',
                'description': 'Get free shipping on any order over $35',
                'min_purchase_amount': 35,
                'valid_until': (datetime.now() + timedelta(days=14)).strftime('%Y-%m-%d'),
                'segment': 'new_customer'
            },
            {
                'type': 'bundle_deal',
                'category': 'Electronics',
                'discount_value': 15,
                'title': 'Electronics Bundle Deal',
                'description': 'Buy 2 or more electronics items and save 15%',
                'min_purchase_amount': 100,
                'valid_until': (datetime.now() + timedelta(days=21)).strftime('%Y-%m-%d'),
                'segment': 'new_customer'
            }
        ]
        
        return generic_offers[:num_offers]
    
    def generate_seasonal_promotions(self, season='current'):
        """Generate seasonal promotions"""
        current_month = datetime.now().month
        
        # Determine season
        if season == 'current':
            if current_month in [12, 1, 2]:
                season = 'winter'
            elif current_month in [3, 4, 5]:
                season = 'spring'
            elif current_month in [6, 7, 8]:
                season = 'summer'
            else:
                season = 'fall'
        
        seasonal_promotions = {
            'winter': [
                {
                    'title': 'Winter Clearance Sale',
                    'description': 'Up to 50% off winter clothing and accessories',
                    'category': 'Clothing',
                    'discount_value': 50,
                    'type': 'clearance'
                },
                {
                    'title': 'Holiday Electronics Deals',
                    'description': 'Special prices on electronics for the holiday season',
                    'category': 'Electronics',
                    'discount_value': 25,
                    'type': 'seasonal'
                }
            ],
            'spring': [
                {
                    'title': 'Spring Home Refresh',
                    'description': '30% off home and garden items for spring cleaning',
                    'category': 'Home',
                    'discount_value': 30,
                    'type': 'seasonal'
                },
                {
                    'title': 'Spring Fashion Collection',
                    'description': 'New arrivals with 20% off spring clothing',
                    'category': 'Clothing',
                    'discount_value': 20,
                    'type': 'new_arrival'
                }
            ],
            'summer': [
                {
                    'title': 'Summer Sports & Outdoors',
                    'description': '25% off sports and outdoor equipment',
                    'category': 'Sports',
                    'discount_value': 25,
                    'type': 'seasonal'
                },
                {
                    'title': 'Summer Electronics Sale',
                    'description': 'Beat the heat with cool deals on electronics',
                    'category': 'Electronics',
                    'discount_value': 20,
                    'type': 'seasonal'
                }
            ],
            'fall': [
                {
                    'title': 'Back to School Special',
                    'description': '30% off electronics and supplies for students',
                    'category': 'Electronics',
                    'discount_value': 30,
                    'type': 'back_to_school'
                },
                {
                    'title': 'Fall Fashion Preview',
                    'description': 'Get ready for fall with 25% off new arrivals',
                    'category': 'Clothing',
                    'discount_value': 25,
                    'type': 'seasonal'
                }
            ]
        }
        
        return seasonal_promotions.get(season, [])
    
    def calculate_promotion_effectiveness(self, promotion_id):
        """Calculate the effectiveness of a promotion"""
        # This would typically query actual promotion performance data
        # For now, return mock effectiveness metrics
        
        effectiveness = {
            'impressions': random.randint(1000, 10000),
            'clicks': random.randint(50, 500),
            'conversions': random.randint(10, 100),
            'revenue_generated': random.uniform(500, 5000),
            'roi': random.uniform(1.5, 4.0)
        }
        
        effectiveness['click_through_rate'] = (effectiveness['clicks'] / effectiveness['impressions']) * 100
        effectiveness['conversion_rate'] = (effectiveness['conversions'] / effectiveness['clicks']) * 100
        
        return effectiveness

def main():
    """Example usage of PromotionEngine"""
    print("Personalized Promotions Engine")
    print("This module provides AI-driven personalized promotion capabilities")
    print("Key features:")
    print("- Customer behavior analysis")
    print("- Personalized offer generation")
    print("- Segment-based promotions")
    print("- Seasonal campaign management")
    print("- Promotion effectiveness tracking")

if __name__ == "__main__":
    main()
