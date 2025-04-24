#!/bin/bash

echo "=== Đang khởi động lại hệ thống Kubernetes ==="

# Build lại Docker images
echo "Building Docker images..."
docker build -t api-gateway:latest ./api-gateway
docker build -t customer-service:latest ./customer-service
docker build -t statistics-service:latest ./statistics-service

# Áp dụng lại cấu hình Kubernetes
echo "Áp dụng lại cấu hình Kubernetes..."
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/persistent-volumes.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/customer-service-deployment.yaml
kubectl apply -f k8s/statistics-service-deployment.yaml
kubectl apply -f k8s/api-gateway-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Đợi các pod khởi động
echo "Đợi các pod khởi động..."
sleep 10

# Kiểm tra trạng thái
echo "=== Trạng thái các pod ==="
kubectl get pods -n customer-management

echo ""
echo "=== Khởi động lại hoàn tất ==="
echo "Để port-forward API Gateway, chạy lệnh:"
echo "kubectl port-forward service/api-gateway 8080:8080 -n customer-management"
