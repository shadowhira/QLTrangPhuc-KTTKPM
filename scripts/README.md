# Tạo dữ liệu mẫu cho hệ thống

Thư mục này chứa các script để tạo dữ liệu mẫu cho khách hàng, đơn hàng, thống kê doanh thu và thống kê khách hàng.

## Cách sử dụng

### Sử dụng script tạo dữ liệu đầy đủ

1. Đảm bảo các service đã được khởi động:

```bash
# Sử dụng Docker Compose
docker-compose up -d

# Hoặc sử dụng Kubernetes
kubectl get pods -n customer-management
```

2. Chạy script tạo dữ liệu mẫu đầy đủ:

```bash
# Tạo tất cả dữ liệu mẫu (khách hàng, đơn hàng, thống kê)
./scripts/generate-complete-data.sh
```

Script này sẽ thực hiện các bước sau:
- Tạo 20 khách hàng mẫu
- Tạo đơn hàng cho các khách hàng (1-5 đơn hàng/khách hàng)
- Tạo dữ liệu thống kê doanh thu và khách hàng

### Sử dụng script tạo dữ liệu thống kê

Nếu bạn chỉ muốn tạo dữ liệu thống kê (không tạo thêm khách hàng và đơn hàng):

```bash
# Tạo tất cả dữ liệu mẫu thống kê (doanh thu và khách hàng)
./scripts/generate-data.sh

# Chỉ tạo dữ liệu mẫu thống kê doanh thu
./scripts/generate-data.sh revenue

# Chỉ tạo dữ liệu mẫu thống kê khách hàng
./scripts/generate-data.sh customer
```

### Sử dụng các script riêng lẻ

Nếu bạn muốn chạy từng script riêng lẻ:

```bash
# Tạo khách hàng mẫu
node scripts/generate-customers.mjs

# Tạo đơn hàng mẫu
node scripts/generate-orders.mjs

# Tạo thống kê doanh thu và khách hàng
node scripts/generate-statistics.mjs
```

## Mô tả các script

### Script chính
- `generate-complete-data.sh`: Script tổng hợp để tạo đầy đủ dữ liệu mẫu (khách hàng, đơn hàng, thống kê)
- `generate-data.sh`: Script để tạo dữ liệu thống kê

### Script con
- `generate-customers.mjs`: Script tạo dữ liệu khách hàng mẫu
- `generate-orders.mjs`: Script tạo dữ liệu đơn hàng mẫu
- `generate-statistics.mjs`: Script tạo dữ liệu thống kê doanh thu và khách hàng
- `generate-revenue-statistics.mjs`: Script chỉ tạo dữ liệu thống kê doanh thu
- `generate-customer-statistics.mjs`: Script chỉ tạo dữ liệu thống kê khách hàng

## Tính năng mới

- Dữ liệu doanh thu được tạo theo mô hình thực tế:
  - Doanh thu cơ bản từ 10-50 triệu/tháng
  - Tăng trưởng 20% mỗi năm
  - Các tháng cao điểm: Tết (tháng 1), mùa cưới (tháng 5-6), cuối năm (tháng 11-12)
  - Số lượng đơn hàng tỷ lệ thuận với doanh thu

## Lưu ý

- Các script này giả định rằng API Gateway đang chạy tại địa chỉ `http://localhost:8080`
- Đảm bảo rằng các service đã được khởi động trước khi chạy script
- Quá trình tạo dữ liệu mẫu có thể mất vài phút tùy thuộc vào số lượng bản ghi cần tạo
- Dữ liệu doanh thu được tạo cho 3 năm gần đây theo tháng và quý, và 10 năm gần đây theo năm
