# Hướng dẫn tích hợp frontend với API Gateway

Tài liệu này hướng dẫn cách tích hợp frontend hiện tại với kiến trúc microservices thông qua API Gateway.

## Tổng quan

API Gateway đã được triển khai và hoạt động ở cổng 8080. Tất cả các API call từ frontend cần được điều hướng qua API Gateway thay vì gọi trực tiếp đến backend cũ.

## Các bước tích hợp

### 1. Cập nhật base URL trong frontend

Thay đổi base URL trong các API call từ:
```javascript
// Cũ (ví dụ)
const API_BASE_URL = 'http://localhost:3000/api';
// hoặc
fetch('/khach-hang')
```

Thành:
```javascript
// Mới
const API_BASE_URL = 'http://localhost:8080/api';
// hoặc
fetch('http://localhost:8080/api/khach-hang')
```

### 2. Kiểm tra cấu trúc dữ liệu

Đảm bảo rằng cấu trúc dữ liệu trả về từ microservices phù hợp với cấu trúc dữ liệu mà frontend đang mong đợi. Nếu có sự khác biệt, bạn cần điều chỉnh code xử lý dữ liệu trong frontend.

### 3. Các API endpoints có sẵn

#### Customer Service (thông qua API Gateway)
- `GET http://localhost:8080/api/khach-hang` - Lấy danh sách khách hàng
- `GET http://localhost:8080/api/khach-hang/{id}` - Lấy thông tin khách hàng theo ID
- `POST http://localhost:8080/api/khach-hang` - Tạo khách hàng mới
- `PUT http://localhost:8080/api/khach-hang/{id}` - Cập nhật thông tin khách hàng
- `DELETE http://localhost:8080/api/khach-hang/{id}` - Xóa khách hàng

- `GET http://localhost:8080/api/trang-phuc` - Lấy danh sách trang phục
- `GET http://localhost:8080/api/trang-phuc/{id}` - Lấy thông tin trang phục theo ID
- `POST http://localhost:8080/api/trang-phuc` - Tạo trang phục mới
- `PUT http://localhost:8080/api/trang-phuc/{id}` - Cập nhật thông tin trang phục
- `DELETE http://localhost:8080/api/trang-phuc/{id}` - Xóa trang phục

- `GET http://localhost:8080/api/don-dat-trang-phuc` - Lấy danh sách đơn đặt trang phục
- `GET http://localhost:8080/api/don-dat-trang-phuc/{id}` - Lấy thông tin đơn đặt trang phục theo ID
- `POST http://localhost:8080/api/don-dat-trang-phuc` - Tạo đơn đặt trang phục mới
- `PATCH http://localhost:8080/api/don-dat-trang-phuc/{id}/trang-thai?trangThai=...` - Cập nhật trạng thái đơn đặt trang phục

#### Statistics Service (thông qua API Gateway)
- `GET http://localhost:8080/api/statistics/doanh-thu` - Lấy thống kê doanh thu
- `GET http://localhost:8080/api/statistics/doanh-thu/monthly/{year}/{month}` - Tạo thống kê doanh thu theo tháng
- `GET http://localhost:8080/api/statistics/doanh-thu/quarterly/{year}/{quarter}` - Tạo thống kê doanh thu theo quý
- `GET http://localhost:8080/api/statistics/doanh-thu/yearly/{year}` - Tạo thống kê doanh thu theo năm

- `GET http://localhost:8080/api/statistics/khach-hang-doanh-thu` - Lấy thống kê doanh thu theo khách hàng
- `GET http://localhost:8080/api/statistics/khach-hang-doanh-thu/generate` - Tạo thống kê doanh thu cho tất cả khách hàng
- `GET http://localhost:8080/api/statistics/khach-hang-doanh-thu/generate/{khachHangId}` - Tạo thống kê doanh thu cho khách hàng cụ thể

### 4. Ví dụ tích hợp

#### Ví dụ 1: Lấy danh sách khách hàng
```javascript
// Trước khi tích hợp
fetch('/khach-hang')
  .then(response => response.json())
  .then(data => {
    // Xử lý dữ liệu
  });

// Sau khi tích hợp
fetch('http://localhost:8080/api/khach-hang')
  .then(response => response.json())
  .then(data => {
    // Xử lý dữ liệu
  });
```

#### Ví dụ 2: Tạo khách hàng mới
```javascript
// Trước khi tích hợp
fetch('/khach-hang', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(khachHangData),
})
  .then(response => response.json())
  .then(data => {
    // Xử lý dữ liệu
  });

// Sau khi tích hợp
fetch('http://localhost:8080/api/khach-hang', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(khachHangData),
})
  .then(response => response.json())
  .then(data => {
    // Xử lý dữ liệu
  });
```

## Kiểm thử

Sau khi cập nhật các API endpoints, hãy kiểm tra kỹ lưỡng tất cả các chức năng của frontend để đảm bảo rằng chúng hoạt động đúng với kiến trúc microservices mới.

## Xử lý lỗi

Nếu gặp lỗi CORS, hãy đảm bảo rằng:
1. API Gateway đã được cấu hình đúng để cho phép CORS
2. Các microservices đã được cấu hình đúng để cho phép CORS
3. Frontend đang gọi đúng URL của API Gateway

## Hỗ trợ

Nếu bạn gặp bất kỳ vấn đề nào trong quá trình tích hợp, vui lòng liên hệ với đội phát triển để được hỗ trợ.
