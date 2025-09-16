#!/bin/bash

# Deploy monitoring stack for PricePointScout on AKS
set -e

echo "🚀 Deploying PricePointScout Monitoring Stack..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed or not in PATH"
    exit 1
fi

# Check if we're connected to a cluster
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Not connected to a Kubernetes cluster"
    exit 1
fi

echo "✅ Connected to Kubernetes cluster"

# Create monitoring namespace
echo "📝 Creating monitoring namespace..."
kubectl apply -f monitoring/namespace.yaml

# Deploy Prometheus
echo "📊 Deploying Prometheus..."
kubectl apply -f monitoring/prometheus-config.yaml
kubectl apply -f monitoring/prometheus.yaml

# Deploy Node Exporter
echo "🖥️  Deploying Node Exporter..."
kubectl apply -f monitoring/node-exporter.yaml

# Deploy Grafana
echo "📈 Deploying Grafana..."
kubectl apply -f monitoring/grafana.yaml

# Deploy AlertManager
echo "🚨 Deploying AlertManager..."
kubectl apply -f monitoring/alertmanager.yaml

# Deploy Database Exporters
echo "🗄️  Deploying Database Exporters..."
kubectl apply -f monitoring/exporters.yaml

# Deploy Ingress (optional)
echo "🌐 Deploying Monitoring Ingress..."
echo "⚠️  Please update the hostnames in monitoring/ingress.yaml before applying"
# kubectl apply -f monitoring/ingress.yaml

# Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/prometheus -n monitoring
kubectl wait --for=condition=available --timeout=300s deployment/grafana -n monitoring
kubectl wait --for=condition=available --timeout=300s deployment/alertmanager -n monitoring

echo "✅ Monitoring stack deployed successfully!"

# Display access information
echo ""
echo "🎯 Access Information:"
echo "===================="

# Get NodePort services if they exist, otherwise show port-forward commands
echo "📊 Grafana:"
echo "   kubectl port-forward svc/grafana 3000:3000 -n monitoring"
echo "   Then open: http://localhost:3000"
echo "   Default credentials: admin / admin123"
echo ""

echo "📈 Prometheus:"
echo "   kubectl port-forward svc/prometheus-service 9090:9090 -n monitoring"
echo "   Then open: http://localhost:9090"
echo ""

echo "🚨 AlertManager:"
echo "   kubectl port-forward svc/alertmanager 9093:9093 -n monitoring"
echo "   Then open: http://localhost:9093"
echo ""

echo "🔧 Monitoring Status:"
kubectl get pods -n monitoring
echo ""

echo "🎉 Setup Complete! Your monitoring stack is now running."
echo ""
echo "📝 Next Steps:"
echo "1. Configure your application to expose /health and /metrics endpoints"
echo "2. Update AlertManager email configuration in monitoring/alertmanager.yaml"
echo "3. Update Ingress hostnames in monitoring/ingress.yaml"
echo "4. Set up proper authentication for production use"
