"""
Customer Targeting System for Personalized Promotions
Uses customer segmentation and collaborative filtering for targeted campaigns
"""

import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime, timedelta
import random

class CustomerTargetingSystem:
    def __init__(self):
        self.scaler = StandardScaler()
        self.kmeans_model = None
        self.customer_segments = None
        self.product_similarity_matrix = None
        
    def load_customer_data(self):
        """Load and prepare customer data"""
        # Generate synthetic customer data
        np.random.seed(42)
        n_customers = 500
        
        customers = []
        for i in range(n_customers):
            customer = {
                'customer_id': f'CUST_{i+1:04d}',
                'name': f'Customer {i+1}',
                'email': f'customer{i+1}@email.com',
                'phone': f'+1-555-{random.randint(1000, 9999)}',
                'age': random.randint(18, 70),
                'total_spent': random.uniform(50, 5000),
                'order_count': random.randint(1, 50),
                'avg_order_value': random.uniform(25, 500),
                'days_since_last_purchase': random.randint(1, 365),
                'preferred_categories': random.sample(['Electronics', 'Clothing', 'Footwear', 'Home', 'Beauty'], 
                                                   random.randint(1, 3)),
                'purchase_frequency': random.uniform(0.1, 2.0),  # purchases per week
                'price_sensitivity': random.uniform(0.1, 1.0),  # 0 = not sensitive, 1 = very sensitive
                'channel_preference': random.choice(['email', 'sms', 'app', 'all']),
                'location': random.choice(['urban', 'suburban', 'rural']),
                'loyalty_tier': random.choice(['bronze', 'silver', 'gold', 'platinum'])
            }
            customers.append(customer)
        
        self.customer_df = pd.DataFrame(customers)
        return self.customer_df
    
    def segment_customers(self, n_clusters=5):
        """Segment customers using K-means clustering"""
        if self.customer_df is None:
            self.load_customer_data()
        
        # Select features for clustering
        feature_columns = [
            'total_spent', 'order_count', 'avg_order_value',
            'days_since_last_purchase', 'purchase_frequency', 'price_sensitivity'
        ]
        
        X = self.customer_df[feature_columns].fillna(0)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Perform clustering
        self.kmeans_model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        cluster_labels = self.kmeans_model.fit_predict(X_scaled)
        
        # Add cluster labels to customer data
        self.customer_df['segment'] = cluster_labels
        
        # Analyze segments
        self.customer_segments = self._analyze_segments()
        
        return cluster_labels, self.customer_segments
    
    def _analyze_segments(self):
        """Analyze characteristics of each customer segment"""
        segments = {}
        
        for segment_id in self.customer_df['segment'].unique():
            segment_data = self.customer_df[self.customer_df['segment'] == segment_id]
            
            # Calculate segment characteristics
            characteristics = {
                'size': len(segment_data),
                'avg_total_spent': segment_data['total_spent'].mean(),
                'avg_order_count': segment_data['order_count'].mean(),
                'avg_order_value': segment_data['avg_order_value'].mean(),
                'avg_days_since_last_purchase': segment_data['days_since_last_purchase'].mean(),
                'avg_purchase_frequency': segment_data['purchase_frequency'].mean(),
                'avg_price_sensitivity': segment_data['price_sensitivity'].mean(),
                'top_categories': self._get_top_categories(segment_data),
                'preferred_channels': segment_data['channel_preference'].value_counts().to_dict(),
                'loyalty_distribution': segment_data['loyalty_tier'].value_counts().to_dict()
            }
            
            # Assign segment name based on characteristics
            segment_name = self._assign_segment_name(characteristics)
            characteristics['name'] = segment_name
            
            segments[segment_id] = characteristics
        
        return segments
    
    def _get_top_categories(self, segment_data):
        """Get top product categories for a segment"""
        all_categories = []
        for categories in segment_data['preferred_categories']:
            all_categories.extend(categories)
        
        category_counts = pd.Series(all_categories).value_counts()
        return category_counts.head(3).to_dict()
    
    def _assign_segment_name(self, characteristics):
        """Assign meaningful names to segments"""
        avg_spent = characteristics['avg_total_spent']
        avg_frequency = characteristics['avg_purchase_frequency']
        avg_recency = characteristics['avg_days_since_last_purchase']
        
        if avg_spent > 2000 and avg_frequency > 1.0:
            return "VIP Customers"
        elif avg_frequency > 1.2 and avg_recency < 30:
            return "Frequent Buyers"
        elif avg_recency > 180:
            return "At-Risk Customers"
        elif avg_spent < 200:
            return "Budget Shoppers"
        else:
            return "Regular Customers"
    
    def find_target_customers_for_product(self, product_info, max_customers=50):
        """Find target customers for a specific product promotion"""
        if self.customer_df is None or self.customer_segments is None:
            self.segment_customers()
        
        product_category = product_info.get('category', '')
        product_price = product_info.get('price', 0)
        discount_percentage = product_info.get('discount', 0)
        
        # Score customers based on relevance
        customer_scores = []
        
        for _, customer in self.customer_df.iterrows():
            score = 0
            
            # Category interest score
            if product_category in customer['preferred_categories']:
                score += 30
            
            # Price sensitivity score
            if discount_percentage > 0:
                price_sensitivity_bonus = customer['price_sensitivity'] * discount_percentage
                score += price_sensitivity_bonus
            
            # Purchase frequency score
            if customer['purchase_frequency'] > 0.5:
                score += 20
            
            # Recency score (more recent = higher score)
            recency_score = max(0, 30 - customer['days_since_last_purchase'] / 10)
            score += recency_score
            
            # Spending capacity score
            if customer['avg_order_value'] >= product_price * 0.5:
                score += 15
            
            # Loyalty tier bonus
            loyalty_bonus = {'bronze': 0, 'silver': 5, 'gold': 10, 'platinum': 15}
            score += loyalty_bonus.get(customer['loyalty_tier'], 0)
            
            customer_scores.append({
                'customer_id': customer['customer_id'],
                'name': customer['name'],
                'email': customer['email'],
                'phone': customer['phone'],
                'segment': customer['segment'],
                'segment_name': self.customer_segments[customer['segment']]['name'],
                'score': score,
                'channel_preference': customer['channel_preference'],
                'price_sensitivity': customer['price_sensitivity']
            })
        
        # Sort by score and return top customers
        customer_scores.sort(key=lambda x: x['score'], reverse=True)
        return customer_scores[:max_customers]
    
    def generate_personalized_offers(self, target_customers, product_info):
        """Generate personalized offers for target customers"""
        offers = []
        
        base_discount = product_info.get('discount', 15)
        product_name = product_info.get('name', 'Product')
        
        for customer in target_customers:
            # Personalize discount based on customer characteristics
            personalized_discount = base_discount
            
            # Adjust discount based on price sensitivity
            if customer['price_sensitivity'] > 0.7:
                personalized_discount += 5  # More discount for price-sensitive customers
            
            # Adjust based on segment
            segment_adjustments = {
                'VIP Customers': 5,  # Higher discount for VIPs
                'At-Risk Customers': 10,  # Aggressive discount to win back
                'Budget Shoppers': 8,  # Higher discount for budget-conscious
                'Frequent Buyers': 3,  # Small bonus for loyalty
                'Regular Customers': 0
            }
            
            personalized_discount += segment_adjustments.get(customer['segment_name'], 0)
            personalized_discount = min(personalized_discount, 40)  # Cap at 40%
            
            # Generate personalized message
            message = self._generate_personalized_message(
                customer['name'], product_name, personalized_discount, customer['segment_name']
            )
            
            # Generate coupon code
            coupon_code = self._generate_coupon_code(product_name, customer['customer_id'])
            
            offer = {
                'customer_id': customer['customer_id'],
                'customer_name': customer['name'],
                'email': customer['email'],
                'phone': customer['phone'],
                'segment': customer['segment_name'],
                'personalized_discount': personalized_discount,
                'coupon_code': coupon_code,
                'message': message,
                'channel': customer['channel_preference'],
                'expected_conversion_rate': self._estimate_conversion_rate(customer, personalized_discount),
                'valid_until': (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
            }
            
            offers.append(offer)
        
        return offers
    
    def _generate_personalized_message(self, customer_name, product_name, discount, segment):
        """Generate personalized promotional message"""
        messages = {
            'VIP Customers': f"Exclusive for you, {customer_name}! Enjoy {discount}% off {product_name} as our valued VIP customer.",
            'Frequent Buyers': f"Hi {customer_name}! Thanks for being a loyal customer. Get {discount}% off {product_name}!",
            'At-Risk Customers': f"We miss you, {customer_name}! Come back with {discount}% off {product_name}.",
            'Budget Shoppers': f"Great deal alert, {customer_name}! Save {discount}% on {product_name} - perfect for your budget!",
            'Regular Customers': f"Hi {customer_name}! Special offer just for you - {discount}% off {product_name}!"
        }
        
        return messages.get(segment, f"Hi {customer_name}! Enjoy {discount}% off {product_name}!")
    
    def _generate_coupon_code(self, product_name, customer_id):
        """Generate unique coupon code"""
        product_code = ''.join([word[0].upper() for word in product_name.split()[:2]])
        customer_code = customer_id[-4:]
        random_num = random.randint(10, 99)
        
        return f"WM{product_code}{customer_code}{random_num}"
    
    def _estimate_conversion_rate(self, customer, discount):
        """Estimate conversion rate for a customer and discount combination"""
        base_rate = 0.15  # 15% base conversion rate
        
        # Adjust based on price sensitivity and discount
        sensitivity_factor = customer['price_sensitivity'] * (discount / 100)
        adjusted_rate = base_rate + sensitivity_factor
        
        # Adjust based on segment
        segment_multipliers = {
            'VIP Customers': 1.3,
            'Frequent Buyers': 1.2,
            'At-Risk Customers': 0.8,
            'Budget Shoppers': 1.1,
            'Regular Customers': 1.0
        }
        
        multiplier = segment_multipliers.get(customer['segment_name'], 1.0)
        final_rate = adjusted_rate * multiplier
        
        return min(final_rate, 0.5)  # Cap at 50%
    
    def optimize_send_timing(self, target_customers):
        """Determine optimal time to send promotions"""
        # Simple heuristic based on customer segments and historical data
        timing_recommendations = {
            'VIP Customers': {'day': 'Tuesday', 'time': '10:00 AM', 'reason': 'High engagement on weekday mornings'},
            'Frequent Buyers': {'day': 'Wednesday', 'time': '2:00 PM', 'reason': 'Peak shopping time'},
            'At-Risk Customers': {'day': 'Friday', 'time': '6:00 PM', 'reason': 'Weekend shopping preparation'},
            'Budget Shoppers': {'day': 'Sunday', 'time': '7:00 PM', 'reason': 'Weekly deal hunting time'},
            'Regular Customers': {'day': 'Thursday', 'time': '12:00 PM', 'reason': 'Lunch break browsing'}
        }
        
        # Group customers by segment
        segment_groups = {}
        for customer in target_customers:
            segment = customer['segment_name']
            if segment not in segment_groups:
                segment_groups[segment] = []
            segment_groups[segment].append(customer)
        
        # Generate timing recommendations
        send_schedule = []
        for segment, customers in segment_groups.items():
            timing = timing_recommendations.get(segment, timing_recommendations['Regular Customers'])
            send_schedule.append({
                'segment': segment,
                'customer_count': len(customers),
                'recommended_day': timing['day'],
                'recommended_time': timing['time'],
                'reason': timing['reason'],
                'customers': [c['customer_id'] for c in customers]
            })
        
        return send_schedule

def main():
    """Example usage of CustomerTargetingSystem"""
    print("Customer Targeting System Demo")
    
    # Initialize system
    targeting_system = CustomerTargetingSystem()
    
    # Load and segment customers
    customer_data = targeting_system.load_customer_data()
    clusters, segments = targeting_system.segment_customers()
    
    print(f"Loaded {len(customer_data)} customers")
    print(f"Created {len(segments)} customer segments")
    
    # Print segment analysis
    for segment_id, segment_info in segments.items():
        print(f"\nSegment {segment_id}: {segment_info['name']}")
        print(f"  Size: {segment_info['size']} customers")
        print(f"  Avg Spent: ${segment_info['avg_total_spent']:.2f}")
        print(f"  Avg Frequency: {segment_info['avg_purchase_frequency']:.2f} purchases/week")
    
    # Example product for targeting
    product_info = {
        'name': 'Winter Jacket',
        'category': 'Clothing',
        'price': 89.99,
        'discount': 20
    }
    
    # Find target customers
    target_customers = targeting_system.find_target_customers_for_product(product_info, max_customers=20)
    print(f"\nFound {len(target_customers)} target customers for {product_info['name']}")
    
    # Generate personalized offers
    offers = targeting_system.generate_personalized_offers(target_customers, product_info)
    
    print("\nTop 5 Personalized Offers:")
    for i, offer in enumerate(offers[:5]):
        print(f"{i+1}. {offer['customer_name']} ({offer['segment']})")
        print(f"   Discount: {offer['personalized_discount']}%")
        print(f"   Coupon: {offer['coupon_code']}")
        print(f"   Expected Conversion: {offer['expected_conversion_rate']:.1%}")
        print()
    
    # Optimize send timing
    send_schedule = targeting_system.optimize_send_timing(target_customers)
    print("Optimal Send Schedule:")
    for schedule in send_schedule:
        print(f"  {schedule['segment']}: {schedule['recommended_day']} at {schedule['recommended_time']}")
        print(f"    ({schedule['customer_count']} customers - {schedule['reason']})")

if __name__ == "__main__":
    main()
