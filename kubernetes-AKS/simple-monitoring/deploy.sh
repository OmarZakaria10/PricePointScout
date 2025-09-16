#!/bin/bash

# Simple deployment script for beginners
echo "🚀 Starting Simple Monitoring Setup..."

# Step 1: Create monitoring namespace
echo "📁 Creating monitoring space..."
kubectl apply -f 1-namespace.yaml

# Step 1b: Setup RBAC permissions for Prometheus
echo "🔐 Setting up security permissions..."
kubectl apply -f 0-prometheus-rbac.yaml

# Step 2: Deploy Prometheus (collects data)
echo "📊 Setting up data collection..."
kubectl apply -f 2-prometheus.yaml

# Step 2b: Deploy Node Exporter (system metrics from each node)
echo "🖥️ Setting up system monitoring on each node..."
kubectl apply -f 2b-node-exporter.yaml

# Step 3: Deploy Grafana (shows charts)
echo "📈 Setting up dashboard..."
kubectl apply -f 3-grafana.yaml

# Step 4: Wait for everything to start
echo "⏳ Waiting for services to start (this may take a few minutes)..."
sleep 30

# Step 5: Show how to access
echo ""
echo "✅ Setup Complete!"
echo ""
echo "🎯 How to Access Your Monitoring:"
echo "================================="
echo ""
echo "📈 Grafana (Dashboard):"
echo "   Run: kubectl port-forward svc/grafana 3000:3000 -n monitoring"
echo "   Then open: http://localhost:3000"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "📊 Prometheus (Raw Data):"
echo "   Run: kubectl port-forward svc/prometheus 9090:9090 -n monitoring"
echo "   Then open: http://localhost:9090"
echo ""
echo "🔍 Check if everything is running:"
kubectl get pods -n monitoring
echo ""
echo "💡 Next Steps:"
echo "1. Add a /health endpoint to your Node.js app"
echo "2. Update your app deployment with: kubectl apply -f 4-app-health.yaml"
echo "3. Access Grafana and explore the dashboards!"
echo ""
echo "❓ Need help? Check the status with:"
echo "   kubectl get pods -n monitoring"
echo "   kubectl logs -f deployment/grafana -n monitoring"
