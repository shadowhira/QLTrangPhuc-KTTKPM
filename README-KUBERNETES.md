# Triển khai ứng dụng Customer Management trên Kubernetes

Tài liệu này hướng dẫn cách triển khai ứng dụng Customer Management trên Kubernetes sử dụng Docker Desktop.

## Yêu cầu

- Docker Desktop với Kubernetes được bật
- kubectl đã được cài đặt
- Java 17 và Maven (để build các service)

## Cấu trúc Kubernetes

Ứng dụng được triển khai với các thành phần sau:

1. **Namespace**: `customer-management`
2. **ConfigMap**: Chứa các cấu hình chung
3. **Secret**: Chứa thông tin nhạy cảm như mật khẩu database
4. **Persistent Volumes**: Lưu trữ dữ liệu cho PostgreSQL và MongoDB
5. **Deployments**:
   - PostgreSQL
   - MongoDB
   - Redis (cho caching)
   - Customer Service
   - Statistics Service
   - API Gateway
6. **Services**: Cho phép các service giao tiếp với nhau
7. **Ingress**: Điều hướng traffic từ bên ngoài vào API Gateway

## Cách triển khai

### 1. Triển khai tự động

Sử dụng script triển khai tự động:

```bash
# Cấp quyền thực thi cho script
chmod +x deploy-kubernetes.sh

# Chạy script
./deploy-kubernetes.sh
```

### 2. Triển khai thủ công

Nếu bạn muốn triển khai thủ công, hãy thực hiện các bước sau:

```bash
# Tạo namespace
kubectl apply -f k8s/namespace.yaml

# Tạo ConfigMap và Secret
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# Tạo Persistent Volume Claims
kubectl apply -f k8s/persistent-volumes.yaml

# Build Docker images
docker build -t customer-service:latest ./customer-service
docker build -t statistics-service:latest ./statistics-service
docker build -t api-gateway:latest ./api-gateway

# Triển khai databases và cache
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/redis-deployment.yaml

# Đợi databases khởi động (khoảng 30 giây)

# Triển khai các service
kubectl apply -f k8s/customer-service-deployment.yaml
kubectl apply -f k8s/statistics-service-deployment.yaml
kubectl apply -f k8s/api-gateway-deployment.yaml

# Triển khai Ingress
kubectl apply -f k8s/ingress.yaml
```

## Kiểm tra trạng thái

Kiểm tra trạng thái các pod:

```bash
kubectl get pods -n customer-management
```

Kiểm tra trạng thái các service:

```bash
kubectl get services -n customer-management
```

## Truy cập ứng dụng

Sau khi triển khai thành công, bạn có thể truy cập ứng dụng qua API Gateway:

```
http://localhost:8080
```

Hoặc nếu bạn đã cấu hình host trong file hosts:

```
http://customer-management.local
```

## Xem logs

Để xem logs của một service:

```bash
kubectl logs -n customer-management deployment/api-gateway
kubectl logs -n customer-management deployment/customer-service
kubectl logs -n customer-management deployment/statistics-service
kubectl logs -n customer-management deployment/redis
```

## Xóa triển khai

Để xóa toàn bộ triển khai:

```bash
kubectl delete namespace customer-management
```

## Xử lý sự cố

### 1. Pod không khởi động

Kiểm tra logs của pod:

```bash
kubectl logs -n customer-management pod/<tên-pod>
```

### 2. Service không thể kết nối

Kiểm tra endpoint của service:

```bash
kubectl get endpoints -n customer-management
```

### 3. Persistent Volume không được tạo

Đảm bảo rằng Kubernetes của bạn hỗ trợ dynamic provisioning. Nếu không, bạn cần tạo Persistent Volume thủ công.

## Tài nguyên bổ sung

- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)


### Chuyển port
kubectl port-forward service/api-gateway 8080:8080 -n customer-management