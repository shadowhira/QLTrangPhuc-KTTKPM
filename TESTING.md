# Hướng dẫn thử nghiệm hệ thống Microservices

Tài liệu này cung cấp hướng dẫn chi tiết về cách thử nghiệm hệ thống microservices bao gồm Customer Service và Statistics Service.

## Chuẩn bị môi trường

1. Đảm bảo bạn đã cài đặt:
   - Java 17
   - Maven
   - Docker và Docker Compose

2. Khởi động hệ thống:
   ```bash
   docker-compose up -d
   ```

3. Kiểm tra trạng thái các container:
   ```bash
   docker-compose ps
   ```

## Kịch bản thử nghiệm

### 1. Thử nghiệm Customer Service

#### 1.1. Lấy danh sách khách hàng

```bash
curl -X GET http://localhost:8081/api/customers
```

Kết quả mong đợi: Danh sách 3 khách hàng đã được tạo sẵn.

#### 1.2. Tạo khách hàng mới

```bash
curl -X POST http://localhost:8081/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Phạm",
    "lastName": "Thị D",
    "phoneNumber": "0934567890",
    "email": "phamthid@example.com",
    "address": {
      "street": "101 Đồng Khởi",
      "district": "Quận 1",
      "city": "TP. Hồ Chí Minh",
      "postalCode": "70000"
    }
  }'
```

Kết quả mong đợi: Thông tin khách hàng mới được tạo, bao gồm ID.

#### 1.3. Lấy thông tin khách hàng theo ID

```bash
curl -X GET http://localhost:8081/api/customers/4
```

Kết quả mong đợi: Thông tin của khách hàng vừa tạo.

#### 1.4. Tạo đơn hàng mới

```bash
curl -X POST http://localhost:8081/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 4,
    "orderDetails": [
      {
        "productId": 1,
        "quantity": 1
      },
      {
        "productId": 2,
        "quantity": 2
      }
    ]
  }'
```

Kết quả mong đợi: Thông tin đơn hàng mới được tạo, bao gồm ID và tổng tiền.

#### 1.5. Cập nhật trạng thái đơn hàng

```bash
curl -X PATCH "http://localhost:8081/api/orders/4/status?status=Paid"
```

Kết quả mong đợi: Thông tin đơn hàng với trạng thái đã được cập nhật thành "Paid".

#### 1.6. Kiểm tra tổng chi tiêu của khách hàng

```bash
curl -X GET http://localhost:8081/api/customers/4
```

Kết quả mong đợi: Thông tin khách hàng với tổng chi tiêu đã được cập nhật.

### 2. Thử nghiệm Statistics Service

#### 2.1. Tạo thống kê doanh thu theo tháng hiện tại

```bash
# Lấy tháng và năm hiện tại
CURRENT_MONTH=$(date +%m)
CURRENT_YEAR=$(date +%Y)

curl -X POST "http://localhost:8082/api/statistics/revenue/monthly?year=$CURRENT_YEAR&month=$CURRENT_MONTH"
```

Kết quả mong đợi: Thông tin thống kê doanh thu theo tháng hiện tại.

#### 2.2. Tạo thống kê doanh thu theo quý hiện tại

```bash
# Tính quý hiện tại
CURRENT_MONTH=$(date +%m)
CURRENT_YEAR=$(date +%Y)
CURRENT_QUARTER=$(( (CURRENT_MONTH - 1) / 3 + 1 ))

curl -X POST "http://localhost:8082/api/statistics/revenue/quarterly?year=$CURRENT_YEAR&quarter=$CURRENT_QUARTER"
```

Kết quả mong đợi: Thông tin thống kê doanh thu theo quý hiện tại.

#### 2.3. Tạo thống kê doanh thu theo năm hiện tại

```bash
CURRENT_YEAR=$(date +%Y)

curl -X POST "http://localhost:8082/api/statistics/revenue/yearly?year=$CURRENT_YEAR"
```

Kết quả mong đợi: Thông tin thống kê doanh thu theo năm hiện tại.

#### 2.4. Tạo thống kê doanh thu cho tất cả khách hàng

```bash
curl -X POST http://localhost:8082/api/statistics/customer-revenue/generate-all
```

Kết quả mong đợi: Danh sách thống kê doanh thu của tất cả khách hàng.

#### 2.5. Lấy thống kê doanh thu của khách hàng theo ID

```bash
curl -X GET http://localhost:8082/api/statistics/customer-revenue/customer/4
```

Kết quả mong đợi: Thông tin thống kê doanh thu của khách hàng có ID là 4.

### 3. Thử nghiệm tích hợp giữa hai service

#### 3.1. Tạo đơn hàng mới và kiểm tra thống kê

1. Tạo đơn hàng mới:
   ```bash
   curl -X POST http://localhost:8081/api/orders \
     -H "Content-Type: application/json" \
     -d '{
       "customerId": 1,
       "orderDetails": [
         {
           "productId": 3,
           "quantity": 1
         }
       ]
     }'
   ```

2. Cập nhật trạng thái đơn hàng:
   ```bash
   curl -X PATCH "http://localhost:8081/api/orders/5/status?status=Paid"
   ```

3. Tạo lại thống kê doanh thu theo tháng:
   ```bash
   CURRENT_MONTH=$(date +%m)
   CURRENT_YEAR=$(date +%Y)
   
   curl -X POST "http://localhost:8082/api/statistics/revenue/monthly?year=$CURRENT_YEAR&month=$CURRENT_MONTH"
   ```

4. Tạo lại thống kê doanh thu cho khách hàng:
   ```bash
   curl -X POST http://localhost:8082/api/statistics/customer-revenue/generate/1
   ```

5. Kiểm tra thống kê doanh thu của khách hàng:
   ```bash
   curl -X GET http://localhost:8082/api/statistics/customer-revenue/customer/1
   ```

Kết quả mong đợi: Thông tin thống kê doanh thu của khách hàng có ID là 1 đã được cập nhật với đơn hàng mới.

## Xử lý lỗi

### 1. Kiểm tra xử lý lỗi khi không tìm thấy tài nguyên

```bash
curl -X GET http://localhost:8081/api/customers/999
```

Kết quả mong đợi: Thông báo lỗi 404 Not Found.

### 2. Kiểm tra xử lý lỗi khi service không khả dụng

1. Dừng Customer Service:
   ```bash
   docker-compose stop customer-service
   ```

2. Thử gọi API từ Statistics Service:
   ```bash
   curl -X POST http://localhost:8082/api/statistics/customer-revenue/generate-all
   ```

Kết quả mong đợi: Thông báo lỗi 503 Service Unavailable.

3. Khởi động lại Customer Service:
   ```bash
   docker-compose start customer-service
   ```

## Dọn dẹp

Khi hoàn thành thử nghiệm, bạn có thể dừng và xóa tất cả các container:

```bash
docker-compose down
```

Nếu bạn muốn xóa cả volume dữ liệu:

```bash
docker-compose down -v
```
