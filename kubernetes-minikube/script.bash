#!/bin/bash
minikube addons enable ingress
minikube addons enable metrics-server
kubectl apply -f namespace.yaml
kubectl apply -f configMap.yaml
kubectl apply -f secret.yaml
kubectl apply -f mongo-depoyment.yaml
kubectl apply -f redis-deployment.yaml
kubectl apply -f pricePointScout-deplyment.yaml  
kubectl apply -f pricePointScout-hpa.yaml
kubectl apply -f ingress.yaml
kubectl get pods,svc,ingress,hpa -n pps-namespace 