# Luồng hoạt động của ứng dụng Customer Management trên Kubernetes

## Sơ đồ tổng quan

```
┌─────────────┐                  ┌─────────────────────────────────────────────────────────────────────┐
│             │                  │                     Kubernetes Cluster                              │
│   Người     │                  │                                                                     │
│   dùng      │   http://domain  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│   Web       ├──────────────────┼─►│             │  │             │  │  Customer   │  │             │ │
│   Browser   │                  │  │   Ingress   ├──┤    API      ├──┤  Service    ├──┤ PostgreSQL  │ │
│             │                  │  │             │  │  Gateway    │  │             │  │             │ │
└─────────────┘                  │  └─────────────┘  └──────┬──────┘  └─────────────┘  └─────────────┘ │
                                 │                          │                                          │
                                 │                          │          ┌─────────────┐  ┌─────────────┐ │
                                 │                          │          │             │  │             │ │
                                 │                          └──────────┤ Statistics  ├──┤  MongoDB    │ │
                                 │                                     │  Service    │  │             │ │
                                 │                                     │             │  │             │ │
                                 │                                     └─────────────┘  └─────────────┘ │
                                 │                                                                     │
                                 └─────────────────────────────────────────────────────────────────────┘
```

## Luồng dữ liệu chi tiết

```
┌─────────────┐     HTTP Request      ┌─────────────┐     HTTP Request     ┌─────────────┐     SQL Queries     ┌─────────────┐
│             │                       │             │                      │             │                     │             │
│   Client    │  ───────────────────► │    API      │  ──────────────────► │  Customer   │  ─────────────────► │ PostgreSQL  │
│   Browser   │                       │   Gateway   │                      │   Service   │                     │   Database  │
│             │  ◄─────────────────── │  (Node.js)  │  ◄────────────────── │  (Spring)   │  ◄───────────────── │             │
│             │     HTTP Response     │             │    HTTP Response     │             │    Query Results    │             │
└─────────────┘                       └──────┬──────┘                      └─────────────┘                     └─────────────┘
                                             │
                                             │                             ┌─────────────┐     MongoDB Queries  ┌─────────────┐
                                             │                            │             │                     │             │
                                             │      HTTP Request          │ Statistics  │                     │             │
                                             └───────────────────────────►│  Service    │ ─────────────────── │   MongoDB   │
                                                                          │  (Spring)   │                     │  Database   │
                                                                          │             │ ◄───────────────── │             │
                                                                          │             │   Query Results     │             │
                                                                          └─────────────┘                     └─────────────┘
```

## Mô tả chi tiết luồng hoạt động

### 1. Người dùng truy cập ứng dụng

- Người dùng truy cập ứng dụng thông qua trình duyệt web tại địa chỉ: **http://domain** hoặc **https://domain**
- Ingress xử lý request đến từ bên ngoài và định tuyến đến API Gateway

### 2. Ingress xử lý request

- **Ingress** nhận request từ người dùng
- Dựa vào host, path và các quy tắc định tuyến, Ingress chuyển request đến API Gateway
- Ingress cũng có thể xử lý SSL/TLS termination cho kết nối HTTPS

### 3. API Gateway xử lý request

- **API Gateway** (Node.js/Express) nhận request từ Ingress
- Dựa vào đường dẫn URL, API Gateway sẽ định tuyến request đến service tương ứng:
  - `/api/khach-hang/*` → Customer Service
  - `/api/trang-phuc/*` → Customer Service
  - `/api/don-dat-trang-phuc/*` → Customer Service
  - `/api/statistics/khach-hang-doanh-thu/*` → Statistics Service
  - `/api/statistics/doanh-thu/*` → Statistics Service

### 4. Customer Service xử lý dữ liệu khách hàng

- **Customer Service** (Spring Boot) nhận request từ API Gateway
- Xử lý logic nghiệp vụ liên quan đến khách hàng, sản phẩm và đơn hàng
- Tương tác với **PostgreSQL** để lưu trữ và truy xuất dữ liệu
- Trả về kết quả cho API Gateway

### 5. Statistics Service xử lý thống kê

- **Statistics Service** (Spring Boot) nhận request từ API Gateway
- Xử lý logic nghiệp vụ liên quan đến thống kê doanh thu và khách hàng
- Tương tác với **MongoDB** để lưu trữ và truy xuất dữ liệu thống kê
- Khi cần, gọi API của Customer Service để lấy dữ liệu khách hàng và đơn hàng
- Trả về kết quả cho API Gateway

### 6. API Gateway trả về kết quả

- **API Gateway** nhận kết quả từ các service
- Định dạng lại response nếu cần
- Trả về kết quả cho người dùng

## Luồng dữ liệu giữa các service

### Customer Service → Statistics Service

```
┌─────────────┐                                  ┌─────────────┐
│             │                                  │             │
│  Customer   │                                  │ Statistics  │
│  Service    │                                  │  Service    │
│             │                                  │             │
└──────┬──────┘                                  └──────┬──────┘
       │                                                │
       │  1. Statistics Service gọi API                 │
       │     để lấy dữ liệu khách hàng                 │
       │ ◄────────────────────────────────────────────┐│
       │                                               ││
       │  2. Customer Service trả về                   ││
       │     dữ liệu khách hàng và đơn hàng           ││
       │ ┌────────────────────────────────────────────►│
       │ │                                             │
       │ │  3. Statistics Service xử lý dữ liệu        │
       │ │     và lưu vào MongoDB                      │
       │ │                                             │
└──────┼─┼─────────────────────────────────────┐      │
       │ │                                     │      │
       │ │                                     ▼      │
┌──────▼─┴────┐                         ┌─────────────┐
│             │                         │             │
│ PostgreSQL  │                         │  MongoDB    │
│  Database   │                         │  Database   │
│             │                         │             │
└─────────────┘                         └─────────────┘
```

## Cấu trúc Kubernetes

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                 │
│  Namespace: customer-management                                                                 │
│                                                                                                 │
│  ┌─────────────────┐                                                                            │
│  │                 │                                                                            │
│  │     Ingress:    │                                                                            │
│  │   app-ingress   │                                                                            │
│  │                 │                                                                            │
│  └────────┬────────┘                                                                            │
│           │                                                                                     │
│  ┌────────▼────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐      │
│  │                 │    │                 │    │                 │    │                 │      │
│  │   Deployment:   │    │   Deployment:   │    │   Deployment:   │    │   Deployment:   │      │
│  │   api-gateway   │    │ customer-service│    │statistics-service│    │    postgres    │      │
│  │                 │    │                 │    │                 │    │                 │      │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘    └────────┬────────┘      │
│           │                      │                      │                      │                │
│  ┌────────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐      │
│  │                 │    │                 │    │                 │    │                 │      │
│  │     Service:    │    │     Service:    │    │     Service:    │    │     Service:    │      │
│  │   api-gateway   │    │ customer-service│    │statistics-service│    │    postgres    │      │
│  │   (ClusterIP)   │    │   (ClusterIP)   │    │   (ClusterIP)   │    │   (ClusterIP)   │      │
│  │                 │    │                 │    │                 │    │                 │      │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘    └────────┬────────┘      │
│           │                      │                      │                      │                │
│           │                      │                      │                      │                │
│  ┌────────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐      │
│  │                 │    │                 │    │                 │    │                 │      │
│  │       Pod:      │    │       Pod:      │    │       Pod:      │    │       Pod:      │      │
│  │   api-gateway   │    │ customer-service│    │statistics-service│    │    postgres    │      │
│  │                 │    │                 │    │                 │    │                 │      │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘      │
│                                                                                                 │
│                                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐      │
│  │                 │    │                 │    │                 │    │                 │      │
│  │   Deployment:   │    │   ConfigMap:    │    │     Secret:     │    │ PersistentVolume│      │
│  │     mongodb     │    │   app-config    │    │   db-secrets    │    │     Claims      │      │
│  │                 │    │                 │    │                 │    │                 │      │
│  └────────┬────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘      │
│           │                                                                                     │
│  ┌────────▼────────┐                                                                            │
│  │                 │                                                                            │
│  │     Service:    │                                                                            │
│  │     mongodb     │                                                                            │
│  │   (ClusterIP)   │                                                                            │
│  │                 │                                                                            │
│  └────────┬────────┘                                                                            │
│           │                                                                                     │
│  ┌────────▼────────┐                                                                            │
│  │                 │                                                                            │
│  │       Pod:      │                                                                            │
│  │     mongodb     │                                                                            │
│  │                 │                                                                            │
│  └─────────────────┘                                                                            │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Cấu hình mạng và truy cập

| Service | Type | Port | Truy cập từ bên ngoài | Truy cập trong cluster |
|---------|------|------|------------------------|------------------------|
| Ingress | N/A | 80/443 | http://domain, https://domain | N/A |
| api-gateway | ClusterIP | 8080 | Qua Ingress | http://api-gateway:8080 |
| customer-service | ClusterIP | 8081 | Không trực tiếp (qua API Gateway) | http://customer-service:8081 |
| statistics-service | ClusterIP | 8082 | Không trực tiếp (qua API Gateway) | http://statistics-service:8082 |
| postgres | ClusterIP | 5432 | Không | jdbc:postgresql://postgres:5432/customerdb |
| mongodb | ClusterIP | 27017 | Không | mongodb://root:root@mongodb:27017/statisticsdb |

## Luồng dữ liệu trong các trường hợp sử dụng chính

### 1. Xem danh sách khách hàng

```
Browser → Ingress → API Gateway → Customer Service → PostgreSQL → Customer Service → API Gateway → Ingress → Browser
```

### 2. Tạo đơn hàng mới

```
Browser → Ingress → API Gateway → Customer Service → PostgreSQL → Customer Service → API Gateway → Ingress → Browser
```

### 3. Xem thống kê doanh thu

```
Browser → Ingress → API Gateway → Statistics Service → MongoDB → Statistics Service → API Gateway → Ingress → Browser
```

### 4. Tạo thống kê doanh thu mới

```
Browser → Ingress → API Gateway → Statistics Service → Customer Service → PostgreSQL → Customer Service → Statistics Service → MongoDB → Statistics Service → API Gateway → Ingress → Browser
```

## Quản lý cấu hình và bảo mật

- **ConfigMap**: Lưu trữ cấu hình chung như tên ứng dụng, URL service
- **Secret**: Lưu trữ thông tin nhạy cảm như mật khẩu database, chứng chỉ SSL/TLS
- **PersistentVolumeClaim**: Đảm bảo dữ liệu được lưu trữ bền vững cho PostgreSQL và MongoDB

## Mở rộng và khả năng chịu tải

- Mỗi service có thể được mở rộng độc lập bằng cách tăng số lượng replica
- Kubernetes tự động cân bằng tải giữa các replica của cùng một service
- Khi một pod gặp sự cố, Kubernetes sẽ tự động tạo pod mới thay thế
- **HorizontalPodAutoscaler (HPA)**: Tự động điều chỉnh số lượng replica dựa trên mức sử dụng CPU/Memory

## Các thành phần Kubernetes bổ sung

### Ingress

- Đóng vai trò là điểm vào cho lưu lượng từ bên ngoài cluster
- Cung cấp định tuyến dựa trên URL, cân bằng tải, SSL termination
- Cho phép sử dụng tên miền thay vì NodePort
- Cấu hình qua Ingress Resource và được quản lý bởi Ingress Controller

### NetworkPolicy

- Kiểm soát luồng giao tiếp giữa các Pod trong cluster
- Định nghĩa quy tắc cho phép/từ chối kết nối giữa các service
- Tăng cường bảo mật bằng cách giới hạn giao tiếp không cần thiết

### ServiceMesh (Istio/Linkerd)

- Cung cấp quản lý giao tiếp service-to-service nâng cao
- Hỗ trợ circuit breaking, retry, timeout
- Cung cấp mã hóa mTLS giữa các service
- Theo dõi và trực quan hóa luồng giao tiếp

### ExternalDNS

- Tự động cấu hình DNS records cho Ingress và Service
- Tích hợp với các nhà cung cấp DNS như Route53, CloudFlare

### CertManager

- Tự động quản lý và cấp chứng chỉ SSL/TLS
- Tích hợp với Let's Encrypt để cấp chứng chỉ miễn phí
- Tự động gia hạn chứng chỉ trước khi hết hạn
