#!/bin/bash

kubectl apply -f namespace.yaml
kubectl apply -f configMap.yaml
kubectl apply -f secret.yaml
kubectl apply -f mongo-depoyment.yaml
kubectl apply -f redis-deployment.yaml
kubectl apply -f pricePointScout-deplyment.yaml

kubectl get pods -o wide -n=pps-namespace