# 🚀 PricePointScout - Enterprise DevOps & Kubernetes Showcase

<div align="center">

[![Docker Deployment](https://github.com/OmarZakaria10/PricePointScout/actions/workflows/nodetest.yml/badge.svg)](https://github.com/OmarZakaria10/PricePointScout/actions/workflows/nodetest.yml)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green?logo=mongodb)](https://mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-6.0+-red?logo=redis)](https://redis.io/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Production-blue?logo=kubernetes)](https://kubernetes.io/)
[![Helm](https://img.shields.io/badge/Helm_3-Charts-blue?logo=helm)](https://helm.sh/)
[![Terraform](https://img.shields.io/badge/Terraform-AKS-purple?logo=terraform)](https://terraform.io/)
[![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-orange?logo=jenkins)](https://jenkins.io/)
[![ArgoCD](https://img.shields.io/badge/ArgoCD-GitOps-orange?logo=argo)](https://argoproj.github.io/cd/)
[![Cert Manager](https://img.shields.io/badge/Cert_Manager-TLS-green?logo=letsencrypt)](https://cert-manager.io/)
[![Prometheus](https://img.shields.io/badge/Prometheus-Monitoring-orange?logo=prometheus)](https://prometheus.io/)
[![Grafana](https://img.shields.io/badge/Grafana-Dashboards-orange?logo=grafana)](https://grafana.com/)
[![HPA](https://img.shields.io/badge/HPA-Auto_Scaling-blue?logo=kubernetes)](https://kubernetes.io/)

**A Production-Ready E-Commerce Price Comparison Platform Demonstrating Modern Kubernetes & DevOps Practices**

[Features](#-application-features) • [Kubernetes Stack](#-kubernetes-technology-stack) • [Quick Start](#-quick-start) • [Architecture](#-architecture-overview) • [Helm Charts](#-helm-charts)

</div>

---

## 📖 Table of Contents

- [About This Project](#-about-this-project)
- [Application Features](#-application-features)
- [Kubernetes Technology Stack](#-kubernetes-technology-stack)
- [Architecture Overview](#-architecture-overview)
- [Quick Start](#-quick-start)
- [Detailed Documentation](#-detailed-documentation)
  - [Helm Charts (Application & Monitoring)](#-helm-charts)
  - [Horizontal Pod Autoscaler (HPA)](#-horizontal-pod-autoscaler-hpa)
  - [TLS Certificates (Let's Encrypt)](#-tls-certificates-with-cert-manager)
  - [Monitoring Stack (Prometheus & Grafana)](#-monitoring-stack)
  - [Kubernetes Orchestration](#-kubernetes-orchestration)
  - [Terraform Infrastructure (Azure AKS)](#-terraform-infrastructure-as-code)
  - [Jenkins CI/CD Pipeline](#-jenkins-cicd-pipeline)
  - [ArgoCD GitOps](#-argocd-gitops)
  - [Docker Containerization](#-docker-containerization)
  - [Ansible Automation](#-ansible-automation)
- [API Reference](#-api-reference)
- [Author](#-author)

---

## 🎯 About This Project

PricePointScout is a **real-world, production-grade** e-commerce price comparison platform that I built to demonstrate comprehensive Kubernetes and DevOps engineering skills. This project showcases:

### 🎯 Kubernetes & Cloud Native Features
- ✅ **Helm Charts** - Complete application and monitoring stack charts
- ✅ **Horizontal Pod Autoscaler (HPA)** - CPU/Memory-based auto-scaling
- ✅ **TLS Certificates** - Automated Let's Encrypt with cert-manager
- ✅ **NGINX Ingress** - Production load balancing with path-based routing
- ✅ **StatefulSets** - MongoDB replica sets with persistent storage
- ✅ **Complete Monitoring** - Prometheus, Grafana, Node Exporter, Kube State Metrics

### 🔄 CI/CD & GitOps
- ✅ **Jenkins Pipeline** - Multi-stage CI with security scanning
- ✅ **ArgoCD GitOps** - Automated Kubernetes deployments
- ✅ **Terraform IaC** - Azure AKS cluster provisioning
- ✅ **Security Scanning** - Trivy, OWASP, npm audit

---

## 💡 Application Features

### Core Functionality
| Feature | Description |
|---------|-------------|
| 🔍 **Multi-Source Scraping** | Real-time price aggregation from Amazon, Jumia, Noon, ElBadr |
| ⚡ **Redis Caching** | Intelligent caching with 85% hit ratio, 200ms average response |
| 🔐 **JWT Authentication** | Secure token-based auth with HTTP-only cookies |
| 📊 **Search Analytics** | User search history and trend tracking |
| 🛡️ **Enterprise Security** | Rate limiting, XSS protection, input sanitization |

### Technical Highlights
- **Puppeteer with Stealth Plugin** - Anti-detection web scraping
- **MongoDB with Mongoose ODM** - Scalable data persistence
- **Winston Logging** - Structured logging for observability
- **prom-client Metrics** - Custom Prometheus metrics

---

## 🛠 Kubernetes Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        KUBERNETES PRODUCTION STACK                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    INGRESS LAYER (NGINX + TLS)                      │    │
│  │   ┌─────────────────┐    ┌─────────────────┐    ┌───────────────┐   │    │
│  │   │  Let's Encrypt  │──▶│  NGINX Ingress  │──▶│ Path Routing  │   │    │
│  │   │  Cert-Manager   │    │  Controller     │    │ /api → Backend│   │    │
│  │   └─────────────────┘    └─────────────────┘    │ /   → Frontend│   │    │
│  │                                                 └───────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                      │                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     APPLICATION LAYER (HPA Enabled)                 │    │
│  │   ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐    │    │
│  │   │   Backend    │   │   Frontend   │   │         HPA          │    │    │
│  │   │   Pods (3)   │   │   Pods (2)   │   │  CPU: 70% | Mem: 75% │    │    │
│  │   │  (Node.js)   │   │   (React)    │   │  Min: 1  | Max: 5    │    │    │
│  │   └──────────────┘   └──────────────┘   └──────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                      │                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        DATA LAYER (StatefulSets)                    │    │
│  │   ┌──────────────────────────┐    ┌─────────────────────────────┐   │    │
│  │   │    MongoDB StatefulSet   │    │         Redis Cache         │   │    │
│  │   │    (2 replicas + PVC)    │    │      (High Performance)     │   │    │
│  │   └──────────────────────────┘    └─────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      MONITORING NAMESPACE                           │    │
│  │   ┌────────────┐  ┌────────────┐  ┌──────────────┐  ┌────────────┐  │    │
│  │   │ Prometheus │  │  Grafana   │  │Node Exporter │  │ Kube State │  │    │
│  │   │  (10Gi PV) │  │ Dashboards │  │  DaemonSet   │  │  Metrics   │  │    │
│  │   └────────────┘  └────────────┘  └──────────────┘  └────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Category | Technologies |
|----------|-------------|
| **Orchestration** | Kubernetes (AKS, Minikube), Helm 3, HPA |
| **Ingress** | NGINX Ingress Controller, Path-based Routing |
| **TLS/SSL** | Cert-Manager, Let's Encrypt (ACME HTTP01) |
| **Monitoring** | Prometheus, Grafana, Node Exporter, Kube State Metrics |
| **CI/CD** | Jenkins Pipelines, ArgoCD GitOps |
| **Infrastructure** | Terraform (Azure AKS) |
| **Security** | Trivy, OWASP Dependency Check, npm audit |
| **Containerization** | Docker, Multi-stage Builds |

---

## 🏗 Architecture Overview

```
                              ┌─────────────────────────────────────────────────┐
                              │              KUBERNETES CLUSTER                 │
                              │                                                 │
   HTTPS Traffic              │  ┌───────────────────────────────────────────┐  │
        │                     │  │           INGRESS CONTROLLER              │  │
        ▼                     │  │  ┌────────────────────────────────────┐   │  │
┌──────────────┐              │  │  │  NGINX + TLS (Let's Encrypt)       │   │  │
│   Internet   │────────────▶│  │  │  • cert-manager.io/cluster-issuer  │   │  │
│   Users      │              │  │  │  • letsencrypt-prod                │   │  │
└──────────────┘              │  │  └────────────────┬───────────────────┘   │  │
                              │  └───────────────────┼───────────────────────┘  │
                              │                      │                          │
                              │         ┌────────────┴────────────┐             │
                              │         │                         │             │
                              │         ▼                         ▼             │
                              │  ┌─────────────┐          ┌─────────────┐       │
                              │  │ /api/*      │          │ /*          │       │
                              │  │ Backend     │          │ Frontend    │       │
                              │  │ Service     │          │ Service     │       │
                              │  └──────┬──────┘          └──────┬──────┘       │
                              │         │                        │              │
                              │         ▼                        ▼              │
                              │  ┌─────────────────┐     ┌─────────────────┐    │
                              │  │  Backend Pods   │     │  Frontend Pods  │    │
                              │  │  (HPA: 1-5)     │     │  (Replicas: 2)  │    │
                              │  │  ┌───┐ ┌───┐    │     │  ┌───┐ ┌───┐    │    │
                              │  │  │Pod│ │Pod│    │     │  │Pod│ │Pod│    │    │
                              │  │  └───┘ └───┘    │     │  └───┘ └───┘    │    │
                              │  └────────┬────────┘     └─────────────────┘    │
                              │           │                                     │
                              │           ▼                                     │
                              │  ┌─────────────────────────────────────────┐    │
                              │  │           DATA LAYER                    │    │
                              │  │  ┌─────────────────┐ ┌────────────────┐ │    │
                              │  │  │ MongoDB         │ │ Redis          │ │    │
                              │  │  │ StatefulSet     │ │ Deployment     │ │    │
                              │  │  │ (2 replicas)    │ │ (Cache Layer)  │ │    │
                              │  │  │ + PVC Storage   │ │                │ │    │
                              │  │  └─────────────────┘ └────────────────┘ │    │ 
                              │  └─────────────────────────────────────────┘    │
                              │                                                 │
                              │  ┌─────────────────────────────────────────┐    │
                              │  │       MONITORING NAMESPACE              │    │
                              │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ │    │
                              │  │  │Prometheus│ │ Grafana  │ │  Node    │ │    │
                              │  │  │ + PVC    │ │Dashboard │ │ Exporter │ │    │
                              │  │  │ (10Gi)   │ │          │ │DaemonSet │ │    │
                              │  │  └──────────┘ └──────────┘ └──────────┘ │    │
                              │  └─────────────────────────────────────────┘    │
                              └─────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Option 1: Local Docker Compose (Fastest)

```bash
# Clone the repository
git clone https://github.com/OmarZakaria10/PricePointScout.git
cd PricePointScout

# Start all services
docker-compose up -d

# Verify services are running
docker-compose ps

# Access the application
curl http://localhost:8080/health
```
<!-- 
### Option 2: Local Kubernetes (Minikube)

```bash
# Start Minikube
minikube start --memory=4096 --cpus=2

# Deploy the application
cd kubernetes-minikube
./script.bash

# Get the service URL
minikube service pricepointscout-service --url -->
<!-- ``` -->

### Option 2: Production Kubernetes with Helm (Recommended)

```bash

# Install cert-manager for TLS (if not already installed)
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# install nginx Ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml

# install metrics-server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Deploy Application Stack
cd helm
helm install pricepointscout ./pricepointscout-chart \
  -n pps-namespace --create-namespace

# Deploy Monitoring Stack
helm install monitoring ./monitoring-chart \
  -n monitoring --create-namespace

# Verify deployments
kubectl get pods -n pps-namespace
kubectl get pods -n monitoring
```

---

## 📚 Detailed Documentation

---

## ⎈ Helm Charts

### What I Built

Two comprehensive Helm charts: one for the complete application stack and one for the monitoring infrastructure.

### Helm Charts Structure

```
helm/
├── pricepointscout-chart/           # Application Stack
│   ├── Chart.yaml
│   ├── values.yaml                  # All configurable values
│   └── templates/
│       ├── app/
│       │   ├── app-deployment.yaml       # Backend deployment
│       │   ├── app-frontend-deployment.yaml  # React frontend
│       │   ├── app-hpa.yaml              # ⭐ Horizontal Pod Autoscaler
│       │   ├── app-ingress.yaml          # ⭐ NGINX Ingress + TLS
│       │   ├── clusterissuer.yaml        # ⭐ Let's Encrypt issuer
│       │   ├── app-configmap.yaml
│       │   ├── app-secret.yaml
│       │   └── app-service.yaml
│       ├── mongodb/
│       │   ├── mongodb-statefulset.yaml  # MongoDB with PVC
│       │   ├── mongodb-headless-service.yaml
│       │   └── mongodb-pvc.yaml
│       └── redis/
│           ├── redis-deployment.yaml
│           └── redis-service.yaml
│
└── monitoring-chart/                # Monitoring Stack
    ├── Chart.yaml
    ├── values.yaml
    ├── INSTALLATION_GUIDE.md
    └── templates/
        ├── prometheus-deployment.yaml
        ├── prometheus-configmap.yaml
        ├── prometheus-pvc.yaml
        ├── prometheus-rbac.yaml
        ├── grafana-deployment.yaml
        ├── grafana-dashboards-configmap.yaml
        ├── grafana-datasource-configmap.yaml
        ├── node-exporter-daemonset.yaml
        ├── kube-state-metrics-deployment.yaml
        └── kube-state-metrics-rbac.yaml
```

### Monitoring Chart Resources (19 Total)

| Resource Type | Count | Components |
|--------------|-------|------------|
| Namespace | 1 | `monitoring` |
| Deployments | 3 | Prometheus, Grafana, Kube State Metrics |
| DaemonSet | 1 | Node Exporter (runs on every node) |
| Services | 4 | Prometheus, Grafana, Node Exporter, KSM |
| ConfigMaps | 3 | Prometheus config, Grafana datasources, dashboards |
| ServiceAccounts | 2 | Prometheus, Kube State Metrics |
| ClusterRoles | 2 | Prometheus RBAC, KSM RBAC |
| PersistentVolumeClaim | 1 | Prometheus storage (10Gi) |

### How to Use

**Install Application Chart:**
```bash
cd helm

# Install with default values
helm install pricepointscout ./pricepointscout-chart -n pps-namespace --create-namespace

# Install with custom values
helm install pricepointscout ./pricepointscout-chart \
  -n pps-namespace --create-namespace \
  --set hpa.maxReplicas=10 \
  --set ingress.host="myapp.example.com" \
  --set ingress.tls.enabled=true

# Or use custom values file
helm install pricepointscout ./pricepointscout-chart \
  -n pps-namespace \
  -f my-values.yaml
```

**Install Monitoring Chart:**
```bash
# Install monitoring stack
helm install monitoring ./monitoring-chart -n monitoring --create-namespace

# With custom Grafana password
helm install monitoring ./monitoring-chart \
  -n monitoring --create-namespace \
  --set grafana.adminPassword=securePassword123
```

**Helm Management Commands:**
```bash
# List installed releases
helm list -A

# Upgrade release
helm upgrade pricepointscout ./pricepointscout-chart -n pps-namespace

# Rollback to previous version
helm rollback pricepointscout 1 -n pps-namespace

# Uninstall
helm uninstall pricepointscout -n pps-namespace

# Template preview (dry-run)
helm template pricepointscout ./pricepointscout-chart
```

---

## 📈 Horizontal Pod Autoscaler (HPA)

### What I Built

Automatic scaling based on CPU and Memory utilization to handle traffic spikes efficiently.

### HPA Configuration

```yaml
# From helm/pricepointscout-chart/templates/app/app-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: pricepointscout-hpa
  namespace: {{ .Values.app.namespace }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: pricepointscout
  minReplicas: {{ .Values.hpa.minReplicas }}      # Default: 1
  maxReplicas: {{ .Values.hpa.maxReplicas }}      # Default: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: {{ .Values.hpa.metrics.cpu.averageUtilization }}  # 70%
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: {{ .Values.hpa.metrics.memory.averageUtilization }}  # 75%
```

### Configurable Values

```yaml
# values.yaml - HPA Configuration
hpa:
  minReplicas: 1        # Minimum pods (cost-effective baseline)
  maxReplicas: 5        # Maximum pods during peak load
  metrics:
    cpu:
      averageUtilization: 70    # Scale up when CPU > 70%
    memory:
      averageUtilization: 75    # Scale up when Memory > 75%
```

### How to Use

**Monitor HPA Status:**
```bash
# View current HPA status
kubectl get hpa -n pps-namespace

# Watch HPA in real-time
kubectl get hpa -n pps-namespace -w

# Detailed HPA information
kubectl describe hpa pricepointscout-hpa -n pps-namespace
```

**Example Output:**
```
NAME                   REFERENCE                  TARGETS           MINPODS   MAXPODS   REPLICAS
pricepointscout-hpa    Deployment/pricepointscout cpu: 45%/70%      1         5         2
                                                   memory: 60%/75%
```

**Customize HPA via Helm:**
```bash
# Deploy with custom HPA settings
helm upgrade pricepointscout ./pricepointscout-chart \
  -n pps-namespace \
  --set hpa.minReplicas=2 \
  --set hpa.maxReplicas=10 \
  --set hpa.metrics.cpu.averageUtilization=60
```

### HPA Scaling Behavior
| Condition | Action |
|-----------|--------|
| CPU > 70% OR Memory > 75% | Scale UP (add pods) |
| CPU < 70% AND Memory < 75% | Scale DOWN after cooldown |
| Replicas < minReplicas | Always maintain minimum |
| Replicas > maxReplicas | Never exceed maximum |

---

## 🔐 TLS Certificates with Cert-Manager

### What I Built

Automated TLS certificate provisioning using Let's Encrypt with HTTP01 challenge.

### ClusterIssuer Configuration

```yaml
# From helm/pricepointscout-chart/templates/app/clusterissuer.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    # Let's Encrypt production server
    server: https://acme-v02.api.letsencrypt.org/directory

    # Email for certificate expiration notifications
    email: omarzakaria439@gmail.com

    # Secret to store the ACME account private key
    privateKeySecretRef:
      name: letsencrypt-prod-key

    # ACME challenge solver using HTTP01
    solvers:
      - http01:
          ingress:
            class: nginx
```

### Ingress with TLS

```yaml
# From helm/pricepointscout-chart/templates/app/app-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: pricepointscout-ingress
  namespace: {{ .Values.app.namespace }}
  annotations:
    # Cert-manager annotations for automatic TLS
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    
    # Security headers
    nginx.ingress.kubernetes.io/proxy-real-ip-cidr: "0.0.0.0/0"
    nginx.ingress.kubernetes.io/use-forwarded-headers: "true"
    
    # Timeouts for scraping operations (up to 3 minutes)
    nginx.ingress.kubernetes.io/proxy-read-timeout: "180"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - {{ .Values.ingress.host }}          # e.g., pricepointscout.dev
    secretName: {{ .Values.ingress.tls.secretName }}  # pricepointscout-tls
  rules:
  - host: {{ .Values.ingress.host }}
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: pricepointscout-service
            port:
              number: 8080
      - path: /
        pathType: Prefix
        backend:
          service:
            name: pricepointscout-frontend-service
            port:
              number: 80
```

### TLS Configuration in values.yaml

```yaml
# Ingress Configuration
ingress:
  enabled: true
  className: nginx
  host: "pricepointscout.dev"   # Your domain
  
  # TLS Configuration
  tls:
    enabled: true
    secretName: pricepointscout-tls
  
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
```

### How to Use

**Prerequisites - Install Cert-Manager:**
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Verify installation
kubectl get pods -n cert-manager
```

**Deploy with TLS Enabled:**
```bash
# Deploy with your domain
helm install pricepointscout ./pricepointscout-chart \
  -n pps-namespace --create-namespace \
  --set ingress.host="yourdomain.com" \
  --set ingress.tls.enabled=true
```

**Verify Certificate:**
```bash
# Check certificate status
kubectl get certificate -n pps-namespace

# View certificate details
kubectl describe certificate pricepointscout-tls -n pps-namespace

# Check the secret created by cert-manager
kubectl get secret pricepointscout-tls -n pps-namespace
```

**Expected Certificate Status:**
```
NAME                  READY   SECRET                AGE
pricepointscout-tls   True    pricepointscout-tls   5m
```

### TLS Flow
```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌─────────────┐
│   Ingress   │──▶│ Cert-Manager │──▶│ Let's Encrypt│ ─▶│ Certificate │
│  (TLS Req)  │    │  Controller  │    │    ACME      │    │   Secret    │
└─────────────┘    └──────────────┘    └──────────────┘    └─────────────┘
```

---

## 📊 Monitoring Stack

### What I Built

Complete observability solution with Prometheus for metrics, Grafana for visualization, Node Exporter for system metrics, and Kube State Metrics for Kubernetes object states.

### Stack Components

| Component | Purpose | Image Version |
|-----------|---------|---------------|
| **Prometheus** | Metrics collection, storage, alerting | v2.45.0 |
| **Grafana** | Dashboards and visualization | 10.0.0 |
| **Node Exporter** | System-level metrics (CPU, memory, disk) | v1.6.0 |
| **Kube State Metrics** | Kubernetes object states | v2.9.2 |

### Prometheus Configuration

```yaml
# values.yaml - Prometheus settings
prometheus:
  enabled: true
  replicas: 1
  image:
    repository: prom/prometheus
    tag: v2.45.0
  
  resources:
    requests:
      cpu: 100m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 1Gi
  
  # Persistent storage for metrics
  storage:
    enabled: true
    storageClass: "do-block-storage"  # Or "managed-csi" for Azure
    size: 10Gi
  
  # Scrape configuration
  scrapeInterval: 15s
  retention: 7d
  
  # Namespaces to monitor
  targetNamespaces:
    - pps-namespace
    - monitoring
```

### Grafana Configuration

```yaml
# values.yaml - Grafana settings
grafana:
  enabled: true
  image:
    repository: grafana/grafana
    tag: 10.0.0
  
  service:
    type: LoadBalancer
    port: 3000
  
  # Admin credentials
  adminUser: admin
  adminPassword: admin123  # Change this!
  
  # Auto-configured Prometheus datasource
  datasources:
    prometheus:
      url: http://prometheus-service:9090
```

### How to Use

**Install Monitoring Stack:**
```bash
cd helm

# Install with defaults
helm install monitoring ./monitoring-chart -n monitoring --create-namespace

# With custom settings
helm install monitoring ./monitoring-chart \
  -n monitoring --create-namespace \
  --set grafana.adminPassword=securePassword \
  --set prometheus.storage.size=20Gi
```

**Verify Installation:**
```bash
# Check all pods are running
kubectl get pods -n monitoring

# Expected output:
# prometheus-xxxxx          1/1     Running
# grafana-xxxxx             1/1     Running
# node-exporter-xxxxx       1/1     Running (one per node)
# kube-state-metrics-xxxxx  1/1     Running

# Check services
kubectl get svc -n monitoring

# Check persistent volume
kubectl get pvc -n monitoring
```

**Access Grafana:**
```bash
# Get LoadBalancer IP
kubectl get svc grafana -n monitoring

# Or port-forward for local access
kubectl port-forward svc/grafana 3000:3000 -n monitoring

# Access at http://localhost:3000
# Username: admin
# Password: admin123 (or your custom password)
```

**Access Prometheus:**
```bash
# Port-forward Prometheus
kubectl port-forward svc/prometheus-service 9090:9090 -n monitoring

# Access at http://localhost:9090
```

### Useful Prometheus Queries

```promql
# Request rate per second
rate(http_requests_total[5m])

# Error rate percentage
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100

# 95th percentile response time
histogram_quantile(0.95, rate(http_response_time_seconds_bucket[5m]))

# Pod CPU usage
rate(container_cpu_usage_seconds_total{namespace="pps-namespace"}[5m])

# Pod memory usage
container_memory_usage_bytes{namespace="pps-namespace"}

# HPA current replicas
kube_horizontalpodautoscaler_status_current_replicas{hpa="pricepointscout-hpa"}
```

### Pre-configured Dashboards

The monitoring chart includes pre-configured Grafana dashboards:
- **Application Metrics** - Request rates, response times, error rates
- **Kubernetes Cluster** - Node health, pod status, resource usage
- **Node Exporter** - System metrics per node

---

## ☸️ Kubernetes Orchestration

### What I Built

Production-ready Kubernetes manifests for both local development (Minikube) and cloud production (Azure AKS).

### Files Location
```
├── kubernetes-AKS/                # Production Azure AKS
│   ├── namespace.yaml             # Namespace isolation
│   ├── configMap.yaml             # Application configuration
│   ├── secret.yaml                # Sensitive data
│   ├── pricePointScout.yaml       # Application deployment
│   ├── pricePointScoutHPA.yaml    # Horizontal Pod Autoscaler
│   ├── mongodb.yaml               # Database StatefulSet
│   ├── redis.yaml                 # Cache deployment
│   └── ingress.yaml               # NGINX Ingress
│
└── kubernetes-minikube/           # Local Development
    ├── namespace.yaml
    ├── pricePointScout-deployment.yaml
    ├── mongo-deployment.yaml
    ├── redis-deployment.yaml
    └── script.bash                # Automated deployment
```

### Key Kubernetes Features

| Feature | Implementation | Purpose |
|---------|---------------|---------|
| **Deployments** | Backend + Frontend | Stateless application workloads |
| **StatefulSets** | MongoDB (2 replicas) | Persistent database with ordered scaling |
| **HPA** | CPU 70% / Memory 75% | Automatic horizontal scaling |
| **Ingress** | NGINX + TLS | External access with SSL termination |
| **ConfigMaps** | Environment variables | Non-sensitive configuration |
| **Secrets** | JWT, DB credentials | Sensitive data management |
| **PVCs** | MongoDB + Prometheus | Persistent storage |
| **Health Probes** | Liveness + Readiness | Self-healing and traffic control |

### How to Use



**Azure AKS (Production):**
```bash
# Connect to AKS
az aks get-credentials --resource-group <rg> --name <cluster>

# Deploy with Helm (recommended)
cd helm
helm install pricepointscout ./pricepointscout-chart -n pps-namespace --create-namespace
helm install monitoring ./monitoring-chart -n monitoring --create-namespace
```

---

## 🏗️ Terraform Infrastructure as Code

### What I Built

Azure AKS cluster provisioning with Terraform for reproducible infrastructure.

### Files Location
```
├── terraform-AKS-Azure/           # Azure Kubernetes Service
│   ├── main.tf                    # AKS cluster definition
│   ├── variables.tf               # Configurable variables
│   ├── outputs.tf                 # Cluster connection info
│   ├── providers.tf               # Azure provider config
│   └── ssh.tf                     # SSH key generation
```

### How to Use

```bash
cd terraform-AKS-Azure

# Initialize Terraform
terraform init

# Preview changes
terraform plan -var="node_count=3"

# Apply infrastructure
terraform apply

# Get Kubernetes credentials
az aks get-credentials \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw kubernetes_cluster_name)

# Cleanup
terraform destroy
```

---

## 🔄 ArgoCD GitOps

### What I Built

GitOps-based continuous deployment - Jenkins triggers ArgoCD to automatically deploy when Kubernetes manifests are updated.

### Architecture

```
┌──────────────┐     ┌───────────────┐     ┌─────────────────────┐
│   Jenkins    │───▶│  ArgoCD Repo  │───▶│  ArgoCD Controller  │
│  (CI Build)  │     │  (Git Source) │     │  (Sync to Cluster)  │
└──────────────┘     └───────────────┘     └─────────────────────┘
       │                     │                        │
       │                     ▼                        ▼
       │              ┌─────────────┐         ┌─────────────┐
       │              │  PR Created │         │  AKS Deploy │
       │              │  Reviewable │         │  Automatic  │
       │              └─────────────┘         └─────────────┘
       │
       ▼
┌──────────────┐
│  Docker Hub  │
│  Image Push  │
└──────────────┘
```

### How It Works

1. **Jenkins builds and pushes** Docker image with Git commit tag
2. **Jenkins updates** the ArgoCD repository with new image tag
3. **Jenkins creates a PR** for review/approval
4. **ArgoCD detects** manifest changes after PR merge
5. **ArgoCD syncs** the new version to AKS cluster

### Pipeline Integration (from Jenkinsfile)

```groovy
stage('Update Argo CD manifests and Create PR') {
    steps {
        sh '''
            # Clone ArgoCD repository
            git clone https://${GITHUB_TOKEN}@github.com/OmarZakaria10/PricePointScout-ArgoCD.git
            
            # Update image tag in Kubernetes manifest
            sed -i "s|omarzakaria10/price-point-scout:.*|omarzakaria10/price-point-scout:${GIT_COMMIT}|g" \
                PricePointScout-ArgoCD/kubernetes-AKS/pricePointScout.yaml
            
            # Create branch and push
            git checkout -b update-build-${BUILD_NUMBER}
            git commit -m "Update image to ${GIT_COMMIT}"
            git push
            
            # Create Pull Request via GitHub API
            curl -X POST https://api.github.com/repos/.../pulls -d @pr.json
        '''
    }
}
```

### How to Use

**Setup ArgoCD:**
```bash
# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d

# Port-forward to access UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Access at https://localhost:8080
```

**Create Application in ArgoCD:**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: pricepointscout
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/OmarZakaria10/PricePointScout-ArgoCD.git
    targetRevision: main
    path: kubernetes-AKS
  destination:
    server: https://kubernetes.default.svc
    namespace: pps-namespace
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

---

## � Jenkins CI/CD Pipeline

### What I Built

Multi-stage Jenkins pipeline with parallel execution, security scanning, and ArgoCD GitOps integration.

### Pipeline Stages

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        JENKINS PIPELINE                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  Stage 1: Install Dependencies                                          │
│  └── npm ci --only=production                                           │
│                                                                         │
│  Stage 2: Parallel Security Scanning ─────────────────────────────────┐ │
│  ├── NPM Audit (all branches)                                         │ │
│  └── OWASP Dependency Check (main/PR only)                            │ │
│                                                                         │
│  Stage 3: Build Docker Image                                            │
│  └── docker build -t ${IMAGE}:${GIT_COMMIT}                             │
│                                                                         │
│  Stage 4: Parallel Testing ──────────────────────────────────────────┐  │
│  ├── Quick Tests (all branches)                                      │  │
│  └── Integration Tests (main/PR only)                                │  │
│                                                                         │
│  Stage 5: Trivy Container Security Scanner                              │
│  └── Vulnerability scanning (LOW, MEDIUM, HIGH, CRITICAL)               │
│                                                                         │
│  Stage 6: Push to Docker Hub                                            │
│  └── docker push ${IMAGE}:${GIT_COMMIT}                                 │
│                                                                         │
│  Stage 7: ArgoCD GitOps Update (main only)                              │
│  └── Update manifests → Create PR → Auto-deploy                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Security Scanning

| Scanner | Purpose | Trigger |
|---------|---------|---------|
| **npm audit** | Dependency vulnerabilities | All branches |
| **OWASP Dependency Check** | Comprehensive CVE scanning | main/PR |
| **Trivy** | Container image vulnerabilities | All branches |

### Key Features

- ✅ Parallel execution for faster builds (6-8 minutes)
- ✅ Docker-based testing for environment consistency
- ✅ Automatic ArgoCD PR creation for GitOps deployment
- ✅ HTML security reports as build artifacts
- ✅ Conditional stages based on branch

---

## 🐳 Docker Containerization

### What I Built

Production-optimized Docker setup with multi-stage builds and security hardening.

### Files
```
├── dockerfile              # Production Dockerfile
├── docker-compose.yaml     # Development stack
└── nginx.conf              # Reverse proxy
```

### Docker Compose Stack
```yaml
Services:
  ├── app        # Node.js application (port 8080)
  ├── mongodb    # Database (port 27018)
  ├── redis      # Cache layer (port 6377)
  └── nginx      # Reverse proxy (port 81)
```

### How to Use

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Scale application
docker-compose up -d --scale app=3

# Stop and cleanup
docker-compose down -v
```

---

## 📡 Ansible Automation

### What I Built

Server configuration automation for Docker installation and application deployment.

### Files Location
```
├── ansible/
│   ├── ansible.cfg              # Ansible configuration
│   ├── hosts.ini                # Inventory file
│   ├── main.yaml                # Main playbook
│   └── roles/
│       ├── common/              # System setup
│       ├── docker/              # Docker installation
│       └── app/                 # Application deployment
```

### How to Use

```bash
cd ansible

# Run on all hosts
ansible-playbook -i hosts.ini main.yaml

# Dry-run (check mode)
ansible-playbook -i hosts.ini main.yaml --check --diff
```

### How to Use

**Deploy Monitoring with Helm:**
```bash
# Install monitoring chart
helm install monitoring ./monitoring-chart -n monitoring --create-namespace
```

---

## 🔌 API Reference

### Health & Metrics

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Application health check |
| `/metrics` | GET | Prometheus metrics |

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/users/signup` | POST | Register new user |
| `/api/v1/users/login` | POST | User login |
| `/api/v1/users/logout` | GET | User logout |

### Product Scraping

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/scrape` | GET | Scrape products (guest) |
| `/api/v1/scrape/auth` | GET | Scrape products (authenticated) |

### Quick Test

```bash
# Health check
curl http://localhost:8080/health

# Search products
curl "http://localhost:8080/api/v1/scrape?keyword=iphone&sources=amazon,jumia"
```

---

## 📊 Project Summary

### Key Kubernetes Features

| Feature | Implementation |
|---------|---------------|
| ⎈ **Helm Charts** | 2 charts (app + monitoring) |
| 📈 **HPA** | CPU 70% / Memory 75% scaling |
| 🔐 **TLS** | Let's Encrypt with cert-manager |
| 📊 **Monitoring** | Prometheus + Grafana + Node Exporter |
| 🔄 **GitOps** | ArgoCD auto-deployment |
| 🛡️ **Security** | Trivy + OWASP scanning |

### Performance Benchmarks

| Metric | Value |
|--------|-------|
| API Response Time | <200ms average |
| Cache Hit Ratio | 85%+ |
| HPA Scaling Response | <30 seconds |
| CI/CD Pipeline Time | 6-8 minutes |

---

## 🛠 Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| kubectl | 1.28+ | Kubernetes CLI |
| Helm | 3.12+ | Package manager |
| Docker | 20+ | Containerization |
| Terraform | 1.5+ | Infrastructure (Azure AKS) |

---

## 👨‍💻 Author

**Omar Zakaria** - DevOps Engineer

[![GitHub](https://img.shields.io/badge/GitHub-OmarZakaria10-black?logo=github)](https://github.com/OmarZakaria10)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Omar_Zakaria-blue?logo=linkedin)](https://www.linkedin.com/in/omar-zakaria-809aa51b9/)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

*Built with ❤️ to demonstrate modern Kubernetes, Helm, and DevOps practices*

**Key Technologies: Kubernetes | Helm | HPA | TLS/Cert-Manager | Prometheus | Grafana | ArgoCD | Jenkins | Terraform**

</div>
