# Microservices Architecture - Customer Management System

Hệ thống quản lý khách hàng được thiết kế theo kiến trúc microservices, bao gồm Customer Service và Statistics Service.

## Cấu trúc hệ thống

- **Customer Service**: Quản lý thông tin khách hàng, sản phẩm và đơn hàng (Spring Boot + PostgreSQL)
- **Statistics Service**: Thực hiện các báo cáo thống kê liên quan đến doanh thu và khách hàng (Spring Boot + MongoDB)

## Yêu cầu

- Java 17
- Maven
- Docker và Docker Compose

## Cách chạy hệ thống

### 1. Chạy toàn bộ hệ thống bằng Docker Compose

```bash
# Chạy tất cả các service
docker-compose up -d

# Kiểm tra trạng thái các container
docker-compose ps

# Xem logs của một service cụ thể
docker-compose logs customer-service
docker-compose logs statistics-service

# Dừng tất cả các service
docker-compose down
```

### 2. Chạy từng service riêng biệt (cho phát triển)

#### Customer Service

```bash
cd customer-service
mvn spring-boot:run
```

#### Statistics Service

```bash
cd statistics-service
mvn spring-boot:run
```

## API Endpoints

### Customer Service (http://localhost:8081)

#### Quản lý khách hàng
- `GET /api/customers` - Lấy danh sách tất cả khách hàng
- `GET /api/customers/{id}` - Lấy thông tin khách hàng theo ID
- `GET /api/customers/by-spending` - Lấy danh sách khách hàng sắp xếp theo tổng chi tiêu
- `POST /api/customers` - Tạo khách hàng mới
- `PUT /api/customers/{id}` - Cập nhật thông tin khách hàng
- `DELETE /api/customers/{id}` - Xóa khách hàng

#### Quản lý đơn hàng
- `GET /api/orders` - Lấy danh sách tất cả đơn hàng
- `GET /api/orders/{id}` - Lấy thông tin đơn hàng theo ID
- `GET /api/orders/customer/{customerId}` - Lấy danh sách đơn hàng của một khách hàng
- `GET /api/orders/date-range?startDate=...&endDate=...` - Lấy danh sách đơn hàng trong khoảng thời gian
- `POST /api/orders` - Tạo đơn hàng mới
- `PATCH /api/orders/{id}/status?status=...` - Cập nhật trạng thái đơn hàng

#### Quản lý sản phẩm
- `GET /api/products` - Lấy danh sách tất cả sản phẩm
- `GET /api/products/{id}` - Lấy thông tin sản phẩm theo ID
- `GET /api/products/type/{type}` - Lấy danh sách sản phẩm theo loại
- `GET /api/products/status/{status}` - Lấy danh sách sản phẩm theo trạng thái
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/{id}` - Cập nhật thông tin sản phẩm
- `DELETE /api/products/{id}` - Xóa sản phẩm

### Statistics Service (http://localhost:8082)

#### Thống kê doanh thu
- `GET /api/statistics/revenue` - Lấy tất cả thống kê doanh thu
- `GET /api/statistics/revenue/{id}` - Lấy thống kê doanh thu theo ID
- `GET /api/statistics/revenue/period/{period}` - Lấy thống kê doanh thu theo kỳ (MONTH, QUARTER, YEAR)
- `POST /api/statistics/revenue/monthly?year=...&month=...` - Tạo thống kê doanh thu theo tháng
- `POST /api/statistics/revenue/quarterly?year=...&quarter=...` - Tạo thống kê doanh thu theo quý
- `POST /api/statistics/revenue/yearly?year=...` - Tạo thống kê doanh thu theo năm

#### Thống kê khách hàng theo doanh thu
- `GET /api/statistics/customer-revenue` - Lấy tất cả thống kê doanh thu theo khách hàng
- `GET /api/statistics/customer-revenue/{id}` - Lấy thống kê doanh thu theo ID
- `GET /api/statistics/customer-revenue/customer/{customerId}` - Lấy thống kê doanh thu của một khách hàng
- `POST /api/statistics/customer-revenue/generate-all` - Tạo thống kê doanh thu cho tất cả khách hàng
- `POST /api/statistics/customer-revenue/generate/{customerId}` - Tạo thống kê doanh thu cho một khách hàng

## Thử nghiệm hệ thống

### 1. Tạo dữ liệu mẫu

Customer Service đã được cấu hình để tự động tạo dữ liệu mẫu khi khởi động. Dữ liệu mẫu bao gồm:
- 3 khách hàng
- 3 sản phẩm
- 3 đơn hàng

### 2. Thử nghiệm API

#### Ví dụ 1: Lấy danh sách khách hàng

```bash
curl -X GET http://localhost:8081/api/customers
```

#### Ví dụ 2: Tạo thống kê doanh thu theo tháng

```bash
curl -X POST "http://localhost:8082/api/statistics/revenue/monthly?year=2023&month=11"
```

#### Ví dụ 3: Lấy thống kê doanh thu của khách hàng

```bash
curl -X GET http://localhost:8082/api/statistics/customer-revenue
```

## Mở rộng hệ thống

Để mở rộng hệ thống, bạn có thể:
1. Thêm các service mới (ví dụ: Authentication Service, Notification Service)
2. Tích hợp API Gateway để quản lý các request
3. Thêm Service Discovery để quản lý các service
4. Triển khai hệ thống lên Kubernetes
