# Microservices Architecture - Customer Management System

Hệ thống quản lý khách hàng được thiết kế theo kiến trúc microservices, bao gồm các module:
- Quản lý khách hàng
- Thống kê khách hàng theo doanh thu
- Thống kê doanh thu theo tháng/quý/năm

## Kiến Trúc Hệ Thống

### Kiến Trúc Theo Chiều Dọc (Microservices)
Hệ thống được chia thành các service độc lập:
- **Customer Service**: Quản lý thông tin khách hàng, trang phục và đơn đặt hàng (Spring Boot + PostgreSQL)
- **Statistics Service**: Thực hiện các báo cáo thống kê liên quan đến doanh thu và khách hàng (Spring Boot + MongoDB)
- **API Gateway**: Điều hướng request đến các service tương ứng (Node.js + Express)
- **Frontend**: Giao diện người dùng xây dựng bằng Next.js

### Kiến Trúc Theo Chiều Ngang (MVC)
Mỗi service đều áp dụng mô hình MVC:
- **Model**: Các entity (KhachHang, TrangPhuc, DonDatTrangPhuc) và repository
- **Controller**: Các controller và service xử lý logic nghiệp vụ
- **View**: Frontend được tách riêng thành ứng dụng Next.js

## Yêu Cầu Hệ Thống

- Java 17
- Maven
- Node.js (v16 trở lên)
- Docker và Docker Compose
- Kubernetes (tùy chọn, cho triển khai)

## Cách Cài Đặt và Chạy Hệ Thống

### 1. Clone Repository

```bash
git clone <repository-url>
cd customer-management-buoi-11-baoCaoThietKe
```

### 2. Chạy Toàn Bộ Hệ Thống Bằng Docker Compose

```bash
# Xây dựng và khởi động tất cả các service
docker-compose up -d

# Kiểm tra trạng thái các container
docker-compose ps

# Xem logs của một service cụ thể
docker-compose logs customer-service
docker-compose logs statistics-service
docker-compose logs api-gateway

# Dừng tất cả các service
docker-compose down
```

Sau khi khởi động thành công, bạn có thể truy cập:
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Customer Service API: http://localhost:8081
- Statistics Service API: http://localhost:8082

### 3. Chạy Từng Service Riêng Biệt (Cho Phát Triển)

#### 3.1. Cài Đặt Cơ Sở Dữ Liệu

```bash
# Khởi động PostgreSQL và MongoDB
docker-compose up -d postgres mongodb
```

#### 3.2. Chạy Customer Service

```bash
cd customer-service
mvn clean install
mvn spring-boot:run
```

Customer Service sẽ chạy tại http://localhost:8081

#### 3.3. Chạy Statistics Service

```bash
cd statistics-service
mvn clean install
mvn spring-boot:run
```

Statistics Service sẽ chạy tại http://localhost:8082

#### 3.4. Chạy API Gateway

```bash
cd api-gateway
npm install
npm start
```

API Gateway sẽ chạy tại http://localhost:8080

#### 3.5. Chạy Frontend

```bash
# Từ thư mục gốc của dự án
npm install
npm run dev
```

Frontend sẽ chạy tại http://localhost:3000

## API Endpoints

### Customer Service (http://localhost:8081)

#### Quản lý khách hàng
- `GET /api/khach-hang` - Lấy danh sách tất cả khách hàng
- `GET /api/khach-hang/{id}` - Lấy thông tin khách hàng theo ID
- `POST /api/khach-hang` - Tạo khách hàng mới
- `PUT /api/khach-hang/{id}` - Cập nhật thông tin khách hàng
- `DELETE /api/khach-hang/{id}` - Xóa khách hàng

#### Quản lý trang phục
- `GET /api/trang-phuc` - Lấy danh sách tất cả trang phục
- `GET /api/trang-phuc/{id}` - Lấy thông tin trang phục theo ID
- `POST /api/trang-phuc` - Tạo trang phục mới
- `PUT /api/trang-phuc/{id}` - Cập nhật thông tin trang phục
- `DELETE /api/trang-phuc/{id}` - Xóa trang phục

#### Quản lý đơn đặt trang phục
- `GET /api/don-dat-trang-phuc` - Lấy danh sách tất cả đơn đặt
- `GET /api/don-dat-trang-phuc/{id}` - Lấy thông tin đơn đặt theo ID
- `GET /api/don-dat-trang-phuc/khach-hang/{khachHangId}` - Lấy danh sách đơn đặt của một khách hàng
- `GET /api/don-dat-trang-phuc/ngay?tuNgay=...&denNgay=...` - Lấy danh sách đơn đặt trong khoảng thời gian
- `POST /api/don-dat-trang-phuc` - Tạo đơn đặt mới
- `PATCH /api/don-dat-trang-phuc/{id}/trang-thai?trangThai=...` - Cập nhật trạng thái đơn đặt

### Statistics Service (http://localhost:8082)

#### Thống kê doanh thu theo thời gian
- `GET /api/revenue-statistics` - Lấy tất cả thống kê doanh thu
- `GET /api/revenue-statistics/{id}` - Lấy thống kê doanh thu theo ID
- `GET /api/revenue-statistics/period/{period}` - Lấy thống kê doanh thu theo kỳ (MONTH, QUARTER, YEAR)
- `POST /api/revenue-statistics/generate/monthly?year=...&month=...` - Tạo thống kê doanh thu theo tháng
- `POST /api/revenue-statistics/generate/quarterly?year=...&quarter=...` - Tạo thống kê doanh thu theo quý
- `POST /api/revenue-statistics/generate/yearly?year=...` - Tạo thống kê doanh thu theo năm

#### Thống kê khách hàng theo doanh thu
- `GET /api/customer-statistics` - Lấy tất cả thống kê doanh thu theo khách hàng
- `GET /api/customer-statistics/{id}` - Lấy thống kê doanh thu theo ID
- `GET /api/customer-statistics/customer/{customerId}` - Lấy thống kê doanh thu của một khách hàng
- `POST /api/customer-statistics/generate` - Tạo thống kê doanh thu cho tất cả khách hàng
- `POST /api/customer-statistics/generate/{customerId}` - Tạo thống kê doanh thu cho một khách hàng

## Cấu Trúc Dữ Liệu

### Customer Service (PostgreSQL)

#### KhachHang
- `id`: Long - ID khách hàng
- `ho`: String - Họ khách hàng
- `ten`: String - Tên khách hàng
- `soDienThoai`: String - Số điện thoại
- `email`: String - Email
- `tongChiTieu`: BigDecimal - Tổng chi tiêu của khách hàng
- `diaChis`: List<DiaChi> - Danh sách địa chỉ

#### TrangPhuc
- `id`: Long - ID trang phục
- `ten`: String - Tên trang phục
- `moTa`: String - Mô tả
- `giaNhap`: BigDecimal - Giá nhập
- `giaBan`: BigDecimal - Giá bán
- `soLuongTon`: Integer - Số lượng tồn kho
- `loai`: String - Loại trang phục

#### DonDatTrangPhuc
- `id`: Long - ID đơn đặt
- `ngayDat`: LocalDateTime - Ngày đặt
- `tongTien`: BigDecimal - Tổng tiền
- `trangThai`: String - Trạng thái đơn ("Chờ xử lý", "Đã thanh toán", "Đã hủy")
- `khachHang`: KhachHang - Khách hàng đặt đơn
- `chiTietDonDats`: List<ChiTietDonDat> - Danh sách chi tiết đơn đặt

### Statistics Service (MongoDB)

#### CustomerRevenueStatistics
- `id`: String - ID thống kê
- `customerId`: Long - ID khách hàng
- `customerName`: String - Tên khách hàng
- `customerEmail`: String - Email khách hàng
- `totalRevenue`: BigDecimal - Tổng doanh thu
- `totalOrders`: Integer - Tổng số đơn hàng
- `revenueByPeriod`: Map<String, BigDecimal> - Doanh thu theo từng kỳ (tháng)
- `lastUpdated`: LocalDateTime - Thời gian cập nhật gần nhất

#### RevenueStatistics
- `id`: String - ID thống kê
- `period`: String - Loại kỳ ("MONTH", "QUARTER", "YEAR")
- `periodValue`: String - Giá trị kỳ (ví dụ: "2023-01", "2023-Q1", "2023")
- `startDate`: LocalDate - Ngày bắt đầu kỳ
- `endDate`: LocalDate - Ngày kết thúc kỳ
- `totalRevenue`: BigDecimal - Tổng doanh thu
- `totalOrders`: Integer - Tổng số đơn hàng
- `createdAt`: LocalDateTime - Thời gian tạo thống kê

## Triển Khai Kubernetes

Hệ thống đã được cấu hình sẵn để triển khai trên Kubernetes:

```bash
# Tạo namespace
kubectl create namespace customer-management

# Tạo secret cho cơ sở dữ liệu
kubectl create secret generic db-secrets \
  --namespace customer-management \
  --from-literal=postgres-user=postgres \
  --from-literal=postgres-password=postgres \
  --from-literal=mongo-user=root \
  --from-literal=mongo-password=root

# Triển khai các service
kubectl apply -f k8s/
```

## Phát Triển

### Cấu Trúc Thư Mục

```
/
├── api-gateway/              # API Gateway Service
├── customer-service/         # Customer Service
│   ├── src/main/java/com/example/customerservice/
│   │   ├── controller/       # REST Controllers
│   │   ├── model/            # Entity Models
│   │   ├── repository/       # Data Repositories
│   │   └── service/          # Business Logic
├── statistics-service/       # Statistics Service
│   ├── src/main/java/com/example/statisticsservice/
│   │   ├── controller/       # REST Controllers
│   │   ├── model/            # Entity Models
│   │   ├── repository/       # Data Repositories
│   │   └── service/          # Business Logic
├── app/                      # Frontend Pages
├── components/               # React Components
├── lib/                      # Shared Utilities
└── k8s/                      # Kubernetes Configurations
```
