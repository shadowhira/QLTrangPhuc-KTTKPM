#!/bin/bash

# Hiển thị thông báo
echo "=== Triển khai ứng dụng Customer Management lên Kubernetes ==="
echo "Đảm bảo Docker Desktop đã được bật và Kubernetes đã được kích hoạt"

# Kiểm tra Kubernetes đã chạy chưa
if ! kubectl cluster-info &> /dev/null; then
  echo "Lỗi: Không thể kết nối đến Kubernetes. Vui lòng đảm bảo Kubernetes đã được bật trong Docker Desktop."
  exit 1
fi

# Tạo namespace nếu chưa tồn tại
kubectl apply -f k8s/namespace.yaml

# Tạo ConfigMap và Secret
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# Tạo Persistent Volume Claims
kubectl apply -f k8s/persistent-volumes.yaml

# Build Docker images
echo "=== Đang build Docker images ==="

# Kiểm tra thư mục customer-service
if [ -d "./customer-service" ]; then
  echo "Building customer-service image..."
  docker build -t customer-service:latest ./customer-service
else
  echo "Thư mục customer-service không tồn tại. Bỏ qua build."
fi

# Kiểm tra thư mục statistics-service
if [ -d "./statistics-service" ]; then
  echo "Building statistics-service image..."
  docker build -t statistics-service:latest ./statistics-service
else
  echo "Thư mục statistics-service không tồn tại. Bỏ qua build."
fi

# Kiểm tra thư mục api-gateway
if [ -d "./api-gateway" ]; then
  echo "Building api-gateway image..."
  docker build -t api-gateway:latest ./api-gateway
else
  echo "Thư mục api-gateway không tồn tại. Bỏ qua build."
fi

# Kiểm tra thư mục frontend
if [ -d "./frontend" ]; then
  echo "Building frontend image..."
  docker build -t frontend:latest ./frontend
else
  echo "Thư mục frontend không tồn tại. Bỏ qua build."
fi

# Triển khai các database
echo "=== Đang triển khai cơ sở dữ liệu ==="
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/mongodb-deployment.yaml

# Đợi database khởi động
echo "=== Đợi cơ sở dữ liệu khởi động (30 giây) ==="
sleep 30

# Triển khai các service
echo "=== Đang triển khai các service ==="

# Kiểm tra file customer-service-deployment.yaml
if [ -f "k8s/customer-service-deployment.yaml" ]; then
  echo "Triển khai customer-service..."
  kubectl apply -f k8s/customer-service-deployment.yaml
else
  echo "File k8s/customer-service-deployment.yaml không tồn tại. Bỏ qua triển khai."
fi

# Kiểm tra file statistics-service-deployment.yaml
if [ -f "k8s/statistics-service-deployment.yaml" ]; then
  echo "Triển khai statistics-service..."
  kubectl apply -f k8s/statistics-service-deployment.yaml
else
  echo "File k8s/statistics-service-deployment.yaml không tồn tại. Bỏ qua triển khai."
fi

# Kiểm tra file api-gateway-deployment.yaml
if [ -f "k8s/api-gateway-deployment.yaml" ]; then
  echo "Triển khai api-gateway..."
  kubectl apply -f k8s/api-gateway-deployment.yaml
else
  echo "File k8s/api-gateway-deployment.yaml không tồn tại. Bỏ qua triển khai."
fi

# Kiểm tra file frontend-deployment.yaml
if [ -f "k8s/frontend-deployment.yaml" ]; then
  echo "Triển khai frontend..."
  kubectl apply -f k8s/frontend-deployment.yaml
else
  echo "File k8s/frontend-deployment.yaml không tồn tại. Bỏ qua triển khai."
fi

# Triển khai Ingress
echo "=== Đang triển khai Ingress ==="

# Kiểm tra file ingress.yaml
if [ -f "k8s/ingress.yaml" ]; then
  echo "Triển khai Ingress..."
  kubectl apply -f k8s/ingress.yaml
else
  echo "File k8s/ingress.yaml không tồn tại. Bỏ qua triển khai."
fi

# Hiển thị trạng thái
echo "=== Trạng thái triển khai ==="
kubectl get all -n customer-management

echo ""
echo "=== Triển khai hoàn tất ==="
echo "Bạn có thể truy cập ứng dụng qua:"
echo "- API Gateway: http://localhost:30080"
echo "- Frontend: http://localhost:30005"
echo "Để xem logs của service, sử dụng lệnh: kubectl logs -n customer-management deployment/[tên-service]"
echo "Ví dụ: kubectl logs -n customer-management deployment/api-gateway"
