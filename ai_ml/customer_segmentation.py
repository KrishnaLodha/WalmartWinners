"""
Customer segmentation module for Walmart Analytics Platform
Implements clustering algorithms to segment customers based on behavior
"""

import pandas as pd
import numpy as np
from sklearn.cluster import KMeans, DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import sqlite3

class CustomerSegmentation:
    def __init__(self, db_path='walmart_analytics.db'):
        self.db_path = db_path
        self.scaler = StandardScaler()
        self.pca = PCA(n_components=2)
        self.kmeans_model = None
        self.customer_segments = None
        
    def load_customer_data(self):
        """Load customer data with purchase history"""
        conn = sqlite3.connect(self.db_path)
        
        query = '''
            SELECT 
                c.id,
                c.name,
                c.email,
                c.total_spent,
                c.order_count,
                c.last_purchase,
                c.loyalty_points,
                COUNT(s.id) as transaction_count,
                AVG(s.total_amount) as avg_order_value,
                MAX(s.sale_date) as last_transaction_date,
                MIN(s.sale_date) as first_transaction_date,
                SUM(s.quantity) as total_items_purchased
            FROM customers c
            LEFT JOIN sales s ON c.id = s.customer_id
            GROUP BY c.id
        '''
        
        self.customer_data = pd.read_sql_query(query, conn)
        conn.close()
        
        # Calculate additional features
        self.customer_data['last_purchase'] = pd.to_datetime(self.customer_data['last_purchase'])
        self.customer_data['days_since_last_purchase'] = (
            datetime.now() - self.customer_data['last_purchase']
        ).dt.days
        
        # Calculate customer lifetime (days between first and last purchase)
        self.customer_data['first_transaction_date'] = pd.to_datetime(self.customer_data['first_transaction_date'])
        self.customer_data['last_transaction_date'] = pd.to_datetime(self.customer_data['last_transaction_date'])
        self.customer_data['customer_lifetime_days'] = (
            self.customer_data['last_transaction_date'] - self.customer_data['first_transaction_date']
        ).dt.days
        
        # Handle division by zero
        self.customer_data['customer_lifetime_days'] = self.customer_data['customer_lifetime_days'].fillna(0)
        
        # Purchase frequency (orders per day)
        self.customer_data['purchase_frequency'] = np.where(
            self.customer_data['customer_lifetime_days'] > 0,
            self.customer_data['order_count'] / self.customer_data['customer_lifetime_days'],
            0
        )
        
        return self.customer_data
    
    def prepare_features_for_clustering(self):
        """Prepare features for customer segmentation"""
        # Select features for clustering
        feature_columns = [
            'total_spent',
            'order_count', 
            'avg_order_value',
            'days_since_last_purchase',
            'purchase_frequency',
            'total_items_purchased',
            'loyalty_points'
        ]
        
        # Handle missing values
        clustering_data = self.customer_data[feature_columns].fillna(0)
        
        # Remove outliers (values beyond 99th percentile)
        for col in feature_columns:
            q99 = clustering_data[col].quantile(0.99)
            clustering_data[col] = np.where(clustering_data[col] > q99, q99, clustering_data[col])
        
        # Scale features
        scaled_features = self.scaler.fit_transform(clustering_data)
        
        return scaled_features, feature_columns
    
    def find_optimal_clusters(self, max_clusters=10):
        """Find optimal number of clusters using elbow method and silhouette score"""
        scaled_features, _ = self.prepare_features_for_clustering()
        
        inertias = []
        silhouette_scores = []
        k_range = range(2, max_clusters + 1)
        
        for k in k_range:
            kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
            cluster_labels = kmeans.fit_predict(scaled_features)
            
            inertias.append(kmeans.inertia_)
            silhouette_scores.append(silhouette_score(scaled_features, cluster_labels))
        
        # Find optimal k (highest silhouette score)
        optimal_k = k_range[np.argmax(silhouette_scores)]
        
        return optimal_k, inertias, silhouette_scores
    
    def perform_kmeans_clustering(self, n_clusters=None):
        """Perform K-means clustering"""
        scaled_features, feature_columns = self.prepare_features_for_clustering()
        
        if n_clusters is None:
            n_clusters, _, _ = self.find_optimal_clusters()
        
        # Perform clustering
        self.kmeans_model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        cluster_labels = self.kmeans_model.fit_predict(scaled_features)
        
        # Add cluster labels to customer data
        self.customer_data['cluster'] = cluster_labels
        
        # Analyze clusters
        cluster_analysis = self.analyze_clusters()
        
        return cluster_labels, cluster_analysis
    
    def analyze_clusters(self):
        """Analyze characteristics of each cluster"""
        if 'cluster' not in self.customer_data.columns:
            raise ValueError("Clustering not performed yet. Run perform_kmeans_clustering first.")
        
        analysis_features = [
            'total_spent', 'order_count', 'avg_order_value',
            'days_since_last_purchase', 'purchase_frequency',
            'total_items_purchased', 'loyalty_points'
        ]
        
        cluster_analysis = self.customer_data.groupby('cluster')[analysis_features].agg([
            'mean', 'median', 'std', 'count'
        ]).round(2)
        
        return cluster_analysis
    
    def assign_segment_names(self):
        """Assign meaningful names to clusters based on characteristics"""
        if 'cluster' not in self.customer_data.columns:
            raise ValueError("Clustering not performed yet.")
        
        # Calculate cluster characteristics
        cluster_stats = self.customer_data.groupby('cluster').agg({
            'total_spent': 'mean',
            'order_count': 'mean',
            'days_since_last_purchase': 'mean',
            'purchase_frequency': 'mean'
        })
        
        segment_names = {}
        
        for cluster_id in cluster_stats.index:
            stats = cluster_stats.loc[cluster_id]
            
            # Define segment based on characteristics
            if stats['total_spent'] > 1000 and stats['purchase_frequency'] > 0.1:
                segment_names[cluster_id] = 'High Value Customers'
            elif stats['purchase_frequency'] > 0.05 and stats['days_since_last_purchase'] < 30:
                segment_names[cluster_id] = 'Frequent Buyers'
            elif stats['days_since_last_purchase'] > 90:
                segment_names[cluster_id] = 'At Risk Customers'
            elif stats['order_count'] < 3:
                segment_names[cluster_id] = 'New Customers'
            else:
                segment_names[cluster_id] = 'Regular Customers'
        
        # Add segment names to customer data
        self.customer_data['segment_name'] = self.customer_data['cluster'].map(segment_names)
        
        return segment_names
    
    def get_segment_recommendations(self):
        """Generate marketing recommendations for each segment"""
        if 'segment_name' not in self.customer_data.columns:
            self.assign_segment_names()
        
        recommendations = {
            'High Value Customers': {
                'strategy': 'VIP Treatment',
                'actions': [
                    'Offer exclusive products and early access',
                    'Provide premium customer service',
                    'Create loyalty rewards program',
                    'Send personalized offers'
                ]
            },
            'Frequent Buyers': {
                'strategy': 'Retention & Upselling',
                'actions': [
                    'Recommend complementary products',
                    'Offer bulk purchase discounts',
                    'Create subscription services',
                    'Gamify shopping experience'
                ]
            },
            'At Risk Customers': {
                'strategy': 'Win-Back Campaign',
                'actions': [
                    'Send re-engagement emails',
                    'Offer comeback discounts',
                    'Survey for feedback',
                    'Retarget with ads'
                ]
            },
            'New Customers': {
                'strategy': 'Onboarding & Education',
                'actions': [
                    'Welcome email series',
                    'Product tutorials and guides',
                    'First purchase incentives',
                    'Social proof and reviews'
                ]
            },
            'Regular Customers': {
                'strategy': 'Engagement & Growth',
                'actions': [
                    'Cross-sell related products',
                    'Seasonal promotions',
                    'Referral programs',
                    'Content marketing'
                ]
            }
        }
        
        return recommendations

def main():
    """Example usage of CustomerSegmentation"""
    print("Customer Segmentation Module")
    print("This module provides ML-based customer segmentation capabilities")
    print("Key features:")
    print("- K-means clustering with optimal cluster selection")
    print("- Customer behavior analysis")
    print("- Segment naming and characterization")
    print("- Marketing recommendations per segment")
    print("- RFM (Recency, Frequency, Monetary) analysis")

if __name__ == "__main__":
    main()
