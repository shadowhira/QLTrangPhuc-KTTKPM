# Hệ thống quản lý khách hàng - Kiến trúc Microservices

Dự án này được tổ chức theo kiến trúc microservices, với các thành phần được tách biệt thành các thư mục riêng.

## Cấu trúc dự án

```
/
├── frontend/               # Frontend Next.js
├── api-gateway/            # API Gateway Service
├── customer-service/       # Customer Service
├── statistics-service/     # Statistics Service
├── k8s/                    # Cấu hình Kubernetes
├── docker-compose.yml      # Cấu hình Docker Compose
├── start-all.sh            # Script khởi động hệ thống
├── stop-all.sh             # Script dừng hệ thống
├── deploy-kubernetes.sh    # Script triển khai lên Kubernetes
└── README.md               # Tài liệu hướng dẫn
```

## Tài liệu tham khảo

- [README-THONG-KE.md](README-THONG-KE.md) - Tài liệu chi tiết về module thống kê
- [README-STRATEGY-PATTERN.md](README-STRATEGY-PATTERN.md) - Tài liệu về mẫu thiết kế Strategy trong module thống kê
- [README-CACHE-PATTERN.md](README-CACHE-PATTERN.md) - Tài liệu về mẫu thiết kế Cache Pattern trong module thống kê
- [README-KUBERNETES.md](README-KUBERNETES.md) - Hướng dẫn triển khai trên Kubernetes
- [SETUP.md](SETUP.md) - Hướng dẫn cài đặt và chạy hệ thống
- [TESTING.md](TESTING.md) - Hướng dẫn thử nghiệm hệ thống
- [application-flow.md](application-flow.md) - Mô tả luồng hoạt động của ứng dụng

## Các thành phần

### Frontend
- Xây dựng bằng Next.js
- Giao diện người dùng cho hệ thống quản lý khách hàng
- Giao tiếp với backend thông qua API Gateway

### API Gateway
- Xây dựng bằng Node.js và Express
- Điều hướng các request từ frontend đến các service tương ứng
- Cổng mặc định: 8080

### Customer Service
- Xây dựng bằng Spring Boot
- Quản lý thông tin khách hàng, trang phục và đơn đặt hàng
- Sử dụng PostgreSQL làm cơ sở dữ liệu
- Cổng mặc định: 8081

### Statistics Service
- Xây dựng bằng Spring Boot
- Thực hiện các báo cáo thống kê liên quan đến doanh thu và khách hàng
- Sử dụng MongoDB làm cơ sở dữ liệu
- Sử dụng Redis cho caching (Cache Pattern)
- Cổng mặc định: 8082

## Cách chạy dự án

### Sử dụng Docker Compose (Khuyến nghị)

```bash
# Khởi động tất cả các service
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng tất cả các service
docker-compose down
```

### Chạy từng service riêng biệt (Cho phát triển)

#### 1. Cài đặt cơ sở dữ liệu và cache

```bash
# Khởi động PostgreSQL, MongoDB và Redis
docker-compose up -d postgres mongodb redis
```

#### 2. Chạy Customer Service

```bash
cd customer-service
mvn clean install
mvn spring-boot:run
```

#### 3. Chạy Statistics Service

```bash
cd statistics-service
mvn clean install
mvn spring-boot:run
```

#### 4. Chạy API Gateway

```bash
cd api-gateway
npm install
npm start
```

#### 5. Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Customer Service (thông qua API Gateway)
- `GET http://localhost:8080/api/khach-hang` - Lấy danh sách khách hàng
- `GET http://localhost:8080/api/khach-hang/{id}` - Lấy thông tin khách hàng theo ID
- `POST http://localhost:8080/api/khach-hang` - Tạo khách hàng mới
- `PUT http://localhost:8080/api/khach-hang/{id}` - Cập nhật thông tin khách hàng
- `DELETE http://localhost:8080/api/khach-hang/{id}` - Xóa khách hàng

### Statistics Service (thông qua API Gateway)
- `GET http://localhost:8080/api/statistics/doanh-thu` - Lấy thống kê doanh thu
- `GET http://localhost:8080/api/statistics/doanh-thu/cache` - Lấy thống kê doanh thu (cached)
- `GET http://localhost:8080/api/statistics/khach-hang-doanh-thu` - Lấy thống kê doanh thu theo khách hàng
- `GET http://localhost:8080/api/statistics/khach-hang-doanh-thu/cache` - Lấy thống kê doanh thu theo khách hàng (cached)

## Triển khai trên Kubernetes

Hệ thống có thể được triển khai trên Kubernetes bằng cách sử dụng script `deploy-kubernetes.sh`:

```bash
# Cấp quyền thực thi cho script
chmod +x deploy-kubernetes.sh

# Chạy script triển khai
./deploy-kubernetes.sh
```

Xem thêm chi tiết trong [README-KUBERNETES.md](README-KUBERNETES.md).

## Phát triển

Mỗi thành phần của hệ thống có thể được phát triển độc lập. Xem README trong từng thư mục con để biết thêm chi tiết về cách phát triển từng thành phần.

## Mẫu thiết kế đã áp dụng

1. **Strategy Pattern**: Áp dụng trong module thống kê để xử lý các loại thống kê khác nhau (theo tháng, quý, năm).
2. **Cache Pattern**: Áp dụng trong module thống kê để cải thiện hiệu suất truy vấn dữ liệu.
3. **Gateway Pattern**: Áp dụng thông qua API Gateway để điều hướng các request từ frontend đến các service tương ứng.
4. **Microservices Pattern**: Kiến trúc tổng thể của hệ thống được tổ chức theo mô hình microservices.
