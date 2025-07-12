# Walmart Sparkathon Analytics Platform

A cutting-edge AI-powered platform designed to optimize Walmart’s supply chain and retail operations with real-time insights, intelligent automation, and personalized customer engagement.

## Key Features

## Core Analytics

- **Real-time Dashboard:** Comprehensive overview of inventory levels, sales performance, demand forecasts, and critical alerts.
- **Inventory Management:** Smart stock level monitoring with automated reorder suggestions and cross-warehouse redistribution.
- **Demand Forecasting:** Machine learning models provide accurate 7-day predictions to optimize inventory planning.
- **Sales Analytics:** Deep insights into revenue trends, product performance, overstock identification, and dynamic pricing updates.
- **Customer Segmentation:** AI-driven analysis for targeted promotions and loyalty rewards.

## AI/ML Capabilities

- **Dynamic Pricing:** Automated price optimization based on demand, competition, and stock levels.
- **Personalized Promotions:** Targeted marketing campaigns using customer behavior and loyalty data.
- **Inventory Optimization:** Smart redistribution and replenishment recommendations across multiple warehouses.
- **Risk Assessment:** Predictive analytics to anticipate supply chain disruptions.

## Advanced Features

- **Multi-warehouse Management:** Real-time tracking and management of inventory across multiple locations.
- **Automated Alerts:** Instant notifications for critical stock levels and operational issues.
- **ROI Tracking:** Performance metrics to support data-driven business decisions.
- **Real-time Sync:** Live data updates across all modules ensuring consistency and accuracy.

## Showcase
- [Watch the Demo on YouTube](https://youtu.be/spf9RD3d24M?si=_QBSvDDLAZMaIeqa)
- [Website link](https://walsmart25.vercel.app/)

## Technology Stack

| **Layer** | **Technologies** |
| --- | --- |
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui, Lucide React |
| Backend | Next.js API Routes, Supabase (PostgreSQL), SQLite (local development) |
| AI/ML | Python, NumPy, Pandas, Scikit-learn, Matplotlib |

## Installation & Setup

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Python v3.8 or higher
- Git

## Steps

1. Clone the repository:
    
    `bashgit clone https://github.com/your-username/walmart-sparkathon-analytics.git
    cd walmart-sparkathon-analytics`
    
2. Install dependencies:
    
    `bashnpm install
    pip install -r requirements.txt`
    
3. Create **`.env.local`** file with:
    
    `textNEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    DATABASE_URL=your_database_url
    OPENAI_API_KEY=your_openai_key  # Optional`
    
4. Setup database:
    - For production (Supabase):
        
        `bashnpm run setup:supabase`
        
    - For local development (SQLite):
        
        `bashpython scripts/setup_database.py`
        
5. Seed sample data:
    
    `bashnpm run seed`
    

## Running the Application

- Development mode:
    
    `bashnpm run dev`
    
- Production build:
    
    `bashnpm run build
    npm start`
    

## AI/ML Scripts

- Run demand forecasting:
    
    `bashpython ai_ml/demand_forecasting.py`
    
- Run customer segmentation:
    
    `bashpython ai_ml/customer_segmentation.py`
    
- Run full ML pipeline:
    
    `bashpython ai_ml/model_training_pipeline.py`
## Quick Start Summary

```bash
git clone https://github.com/lostboysrtk/WalmartWinners.git
cd walmart-sparkathon-analytics
npm install
pip install -r requirements.txt
cp .env.example .env.local
# Edit .env.local to add your credentials
npm run dev

Visit [http://localhost:3000](http://localhost:3000/) and start exploring!
