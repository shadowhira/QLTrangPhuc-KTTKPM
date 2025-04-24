# Các lệnh Kubernetes thường dùng cho ứng dụng Customer Management

## Lệnh cơ bản

### Kiểm tra trạng thái cluster
```bash
# Kiểm tra thông tin cluster
kubectl cluster-info

# Kiểm tra các node trong cluster
kubectl get nodes
```

### Quản lý namespace
```bash
# Tạo namespace
kubectl apply -f k8s/namespace.yaml

# Liệt kê tất cả namespace
kubectl get namespaces

# Xóa namespace (sẽ xóa tất cả tài nguyên trong namespace)
kubectl delete namespace customer-management
```

## Quản lý ứng dụng

### Triển khai ứng dụng
```bash
# Triển khai toàn bộ ứng dụng bằng script
./deploy-kubernetes.sh

# Triển khai từng thành phần
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/persistent-volumes.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/customer-service-deployment.yaml
kubectl apply -f k8s/statistics-service-deployment.yaml
kubectl apply -f k8s/api-gateway-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Triển khai tất cả tài nguyên trong thư mục k8s
kubectl apply -f k8s/
```

### Kiểm tra trạng thái ứng dụng
```bash
# Xem tất cả tài nguyên trong namespace
kubectl get all -n customer-management

# Xem tất cả pod
kubectl get pods -n customer-management

# Xem tất cả service
kubectl get services -n customer-management

# Xem tất cả deployment
kubectl get deployments -n customer-management

# Xem tất cả persistent volume claims
kubectl get pvc -n customer-management

# Xem tất cả configmap và secret
kubectl get configmap,secret -n customer-management

# Xem tất cả ingress
kubectl get ingress -n customer-management
```

### Xem logs và thông tin chi tiết
```bash
# Xem logs của pod
kubectl logs -n customer-management pod/api-gateway-xxxxxxxxxx-xxxxx

# Xem logs của deployment
kubectl logs -n customer-management deployment/api-gateway
kubectl logs -n customer-management deployment/customer-service
kubectl logs -n customer-management deployment/statistics-service

# Xem logs liên tục (theo dõi)
kubectl logs -f -n customer-management deployment/api-gateway

# Xem thông tin chi tiết về pod
kubectl describe pod -n customer-management api-gateway-xxxxxxxxxx-xxxxx

# Xem thông tin chi tiết về service
kubectl describe service -n customer-management api-gateway
```

### Truy cập ứng dụng
```bash
# Port-forward để truy cập API Gateway qua localhost:8080
kubectl port-forward -n customer-management service/api-gateway 8080:8080

# Port-forward để truy cập Customer Service trực tiếp
kubectl port-forward -n customer-management service/customer-service 8081:8081

# Port-forward để truy cập Statistics Service trực tiếp
kubectl port-forward -n customer-management service/statistics-service 8082:8082

# Truy cập API Gateway qua NodePort
# Mở trình duyệt và truy cập: http://localhost:30080
```

### Thao tác với pod
```bash
# Thực thi lệnh trong pod
kubectl exec -it -n customer-management pod/api-gateway-xxxxxxxxxx-xxxxx -- sh

# Tạo pod tạm thời để kiểm tra kết nối
kubectl run -it --rm --restart=Never curl-test --image=curlimages/curl:7.78.0 -n customer-management -- sh

# Trong pod tạm thời, kiểm tra kết nối đến các service
curl http://api-gateway:8080/health
curl http://customer-service:8081/api/khach-hang
curl http://statistics-service:8082/api/statistics/doanh-thu
```

## Quản lý và mở rộng

### Mở rộng ứng dụng
```bash
# Tăng số lượng replica cho deployment
kubectl scale deployment -n customer-management customer-service --replicas=3
kubectl scale deployment -n customer-management statistics-service --replicas=2
kubectl scale deployment -n customer-management api-gateway --replicas=2
```

### Cập nhật ứng dụng
```bash
# Cập nhật image của deployment
kubectl set image deployment/customer-service customer-service=customer-service:v2 -n customer-management

# Cập nhật cấu hình deployment
kubectl edit deployment -n customer-management customer-service
```

### Khởi động lại ứng dụng
```bash
# Khởi động lại tất cả pod trong deployment
kubectl rollout restart deployment -n customer-management customer-service
kubectl rollout restart deployment -n customer-management statistics-service
kubectl rollout restart deployment -n customer-management api-gateway
```

### Xóa tài nguyên
```bash
# Xóa deployment
kubectl delete deployment -n customer-management api-gateway

# Xóa service
kubectl delete service -n customer-management api-gateway

# Xóa tất cả tài nguyên trong namespace
kubectl delete all --all -n customer-management

# Xóa tất cả tài nguyên từ file
kubectl delete -f k8s/api-gateway-deployment.yaml
```

## Xử lý sự cố

### Kiểm tra kết nối mạng
```bash
# Kiểm tra DNS trong cluster
kubectl run -it --rm --restart=Never dns-test --image=busybox:1.28 -n customer-management -- nslookup customer-service

# Kiểm tra kết nối đến service
kubectl run -it --rm --restart=Never curl-test --image=curlimages/curl:7.78.0 -n customer-management -- curl -v http://customer-service:8081/api/khach-hang
```

### Kiểm tra cấu hình
```bash
# Xem cấu hình ConfigMap
kubectl get configmap app-config -n customer-management -o yaml

# Xem cấu hình Secret (đã mã hóa base64)
kubectl get secret db-secrets -n customer-management -o yaml

# Giải mã giá trị trong Secret
echo 'cG9zdGdyZXM=' | base64 --decode
```

### Sao lưu và khôi phục
```bash
# Sao lưu tất cả tài nguyên trong namespace
kubectl get all -n customer-management -o yaml > customer-management-backup.yaml

# Sao lưu ConfigMap và Secret
kubectl get configmap,secret -n customer-management -o yaml > customer-management-config-backup.yaml
```

## Lệnh đặc biệt cho ứng dụng Customer Management

### Kiểm tra API Gateway
```bash
# Kiểm tra health endpoint
curl http://localhost:30080/health

# Kiểm tra API khách hàng
curl http://localhost:30080/api/khach-hang

# Kiểm tra API thống kê
curl http://localhost:30080/api/statistics/doanh-thu
```

### Kiểm tra cơ sở dữ liệu
```bash
# Kết nối đến PostgreSQL
kubectl exec -it -n customer-management pod/postgres-xxxxxxxxxx-xxxxx -- psql -U postgres -d customerdb

# Kết nối đến MongoDB
kubectl exec -it -n customer-management pod/mongodb-xxxxxxxxxx-xxxxx -- mongo -u root -p root --authenticationDatabase admin statisticsdb
```

### Khởi động lại toàn bộ ứng dụng
```bash
# Xóa tất cả pod để Kubernetes tạo lại
kubectl delete pod --all -n customer-management

# Hoặc khởi động lại từng deployment
kubectl rollout restart deployment -n customer-management postgres
kubectl rollout restart deployment -n customer-management mongodb
kubectl rollout restart deployment -n customer-management customer-service
kubectl rollout restart deployment -n customer-management statistics-service
kubectl rollout restart deployment -n customer-management api-gateway
```

## Mẹo và thủ thuật

### Tạo alias cho các lệnh thường dùng
Thêm vào file `~/.bashrc` hoặc `~/.zshrc`:

```bash
# Alias cho namespace
alias k='kubectl'
alias kcm='kubectl -n customer-management'

# Alias cho các lệnh thường dùng
alias kpods='kubectl get pods -n customer-management'
alias klogs='kubectl logs -n customer-management'
alias kservices='kubectl get services -n customer-management'
alias kforward='kubectl port-forward -n customer-management'
```

### Sử dụng kubectl với nhiều context
```bash
# Xem tất cả context
kubectl config get-contexts

# Chuyển đổi context
kubectl config use-context docker-desktop
```

### Theo dõi tài nguyên theo thời gian thực
```bash
# Theo dõi pod theo thời gian thực
kubectl get pods -n customer-management --watch

# Theo dõi tất cả tài nguyên theo thời gian thực
kubectl get all -n customer-management --watch
```

## Tài nguyên bổ sung

- [Kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
- [Helm - Package Manager cho Kubernetes](https://helm.sh/)
