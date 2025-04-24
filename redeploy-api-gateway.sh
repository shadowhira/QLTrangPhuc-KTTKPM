#!/bin/bash

echo "=== Đang cập nhật API Gateway với cấu hình log chi tiết ==="

# Build Docker image mới cho API Gateway
echo "Building API Gateway image..."
docker build -t api-gateway:latest ./api-gateway

# Xóa và triển khai lại API Gateway
echo "Triển khai lại API Gateway..."
kubectl delete -f k8s/api-gateway-deployment.yaml
kubectl apply -f k8s/api-gateway-deployment.yaml

# Đợi API Gateway khởi động
echo "Đợi API Gateway khởi động..."
sleep 5

# Kiểm tra trạng thái
echo "=== Trạng thái API Gateway ==="
kubectl get pods -n customer-management -l app=api-gateway

echo ""
echo "=== Cập nhật hoàn tất ==="
echo "Bạn có thể xem logs của API Gateway bằng lệnh:"
echo "kubectl logs -n customer-management -l app=api-gateway -f"
