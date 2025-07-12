Walmart Sparkathon Analytics Platform
A cutting-edge AI-powered platform designed to optimize Walmart’s supply chain and retail operations with real-time insights, intelligent automation, and personalized customer engagement.

Key Features
Core Analytics
Real-time Dashboard: Comprehensive overview of inventory levels, sales performance, demand forecasts, and critical alerts.

Inventory Management: Smart stock level monitoring with automated reorder suggestions and cross-warehouse redistribution.

Demand Forecasting: Machine learning models provide accurate 7-day predictions to optimize inventory planning.

Sales Analytics: Deep insights into revenue trends, product performance, overstock identification, and dynamic pricing updates.

Customer Segmentation: AI-driven analysis for targeted promotions and loyalty rewards.

AI/ML Capabilities
Dynamic Pricing: Automated price optimization based on demand, competition, and stock levels.

Personalized Promotions: Targeted marketing campaigns using customer behavior and loyalty data.

Inventory Optimization: Smart redistribution and replenishment recommendations across multiple warehouses.

Risk Assessment: Predictive analytics to anticipate supply chain disruptions.

Advanced Features
Multi-warehouse Management: Real-time tracking and management of inventory across multiple locations.

Automated Alerts: Instant notifications for critical stock levels and operational issues.

ROI Tracking: Performance metrics to support data-driven business decisions.

Real-time Sync: Live data updates across all modules ensuring consistency and accuracy.

## Showcase
- [Watch the Demo on YouTube](https://youtu.be/spf9RD3d24M?si=_QBSvDDLAZMaIeqa)
- [Website link](https://walsmart25.vercel.app/)

Technology Stack
Layer	Technologies
Frontend	Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui, Lucide React
Backend	Next.js API Routes, Supabase (PostgreSQL), SQLite (local development)
AI/ML	Python, NumPy, Pandas, Scikit-learn, Matplotlib
Installation & Setup
Prerequisites
Node.js v18 or higher

npm or yarn

Python v3.8 or higher

Git

Steps
Clone the repository:

bash
git clone https://github.com/your-username/walmart-sparkathon-analytics.git
cd walmart-sparkathon-analytics
Install dependencies:

bash
npm install
pip install -r requirements.txt
Create .env.local file with:

text
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
OPENAI_API_KEY=your_openai_key  # Optional
Setup database:

For production (Supabase):

bash
npm run setup:supabase
For local development (SQLite):

bash
python scripts/setup_database.py
Seed sample data:

bash
npm run seed
Running the Application
Development mode:

bash
npm run dev
Production build:

bash
npm run build
npm start
AI/ML Scripts
Run demand forecasting:

bash
python ai_ml/demand_forecasting.py
Run customer segmentation:

bash
python ai_ml/customer_segmentation.py
Run full ML pipeline:

bash
python ai_ml/model_training_pipeline.py
API Endpoints Overview
Module	Endpoint	Purpose
Authentication	POST /api/auth/login	User login
POST /api/auth/signup	User registration
Dashboard	GET /api/dashboard	Fetch dashboard metrics
GET /api/events/today	Fetch today’s events
Inventory	GET /api/inventory	List inventory items
GET /api/inventory/[id]	Get specific item details
POST /api/inventory/replenish	Trigger replenishment
GET /api/inventory/alerts	Get inventory alerts
POST /api/inventory/redistribute	Redistribute stock
Sales & Analytics	GET /api/sales-analytics	Sales data and insights
POST /api/sales-analytics/update-pricing	Update dynamic pricing
Forecasting	GET /api/forecast	Get demand forecasts
POST /api/forecast/retrain	Retrain ML models
GET /api/demand-forecast	Detailed forecast data
Customers	GET /api/customers	Customer data and segments
Promotions	GET /api/promotions	Active promotions
POST /api/promo/send-coupon	Send targeted coupons
GET /api/promo/status/[sku]	Promotion status by SKU
Project Structure
text
walmart-sparkathon-analytics/
├── app/                  # Next.js App Router (pages and API routes)
├── components/           # Reusable UI components
├── lib/                  # Utility functions and database clients
├── ai_ml/                # Python ML modules for forecasting, segmentation, pricing, optimization
├── scripts/              # Database setup and schema scripts
└── public/               # Static assets
Testing
Run frontend/backend tests:

bash
npm test
Run Python ML tests:

bash
python -m pytest ai_ml/tests/
Deployment
Recommended: Deploy on Vercel with GitHub integration and environment variables.

Docker: Build and run container locally:

bash
docker build -t walmart-analytics .
docker run -p 3000:3000 walmart-analytics
Contributing
Fork the repository

Create a feature branch

Commit your changes

Push and open a Pull Request

License
This project is licensed under the MIT License.

Acknowledgments
Thanks to Walmart Sparkathon, Next.js, Supabase, and shadcn/ui teams for their incredible tools and support.

Quick Start Summary
bash
git clone https://github.com/your-username/walmart-sparkathon-analytics.git
cd walmart-sparkathon-analytics
npm install
pip install -r requirements.txt
cp .env.example .env.local
# Edit .env.local to add your credentials
npm run dev
Visit http://localhost:3000 and start exploring!
