# Tạo dữ liệu mẫu cho thống kê

Thư mục này chứa các script để tạo dữ liệu mẫu cho thống kê doanh thu và thống kê khách hàng.

## Cách sử dụng

### 1. Sử dụng giao diện web

Mở file `generate-statistics.html` trong trình duyệt và sử dụng các nút để tạo dữ liệu mẫu:

- **Tạo dữ liệu mẫu thống kê doanh thu**: Tạo khoảng 100 bản ghi thống kê doanh thu theo tháng, quý và năm
- **Tạo dữ liệu mẫu thống kê khách hàng**: Tạo khoảng 50 bản ghi thống kê khách hàng
- **Tạo tất cả dữ liệu mẫu**: Tạo cả hai loại thống kê

### 2. Sử dụng Node.js

Cài đặt thư viện `node-fetch` (nếu chưa có):

```bash
npm install node-fetch
```

Sau đó chạy script:

```bash
# Tạo tất cả dữ liệu mẫu
node generate-statistics.mjs

# Chỉ tạo dữ liệu mẫu thống kê doanh thu
node generate-statistics.mjs revenue

# Chỉ tạo dữ liệu mẫu thống kê khách hàng
node generate-statistics.mjs customer
```

## Các script khác

- `generate-revenue-statistics.mjs`: Script để tạo dữ liệu mẫu cho thống kê doanh thu
- `generate-customer-statistics.mjs`: Script để tạo dữ liệu mẫu cho thống kê khách hàng
- `generate-all-statistics.mjs`: Script để tạo dữ liệu mẫu cho cả hai loại thống kê

## Lưu ý

- Các script này giả định rằng API Gateway đang chạy tại địa chỉ `http://localhost:8080`
- Đảm bảo rằng các service đã được khởi động trước khi chạy script
- Quá trình tạo dữ liệu mẫu có thể mất vài phút tùy thuộc vào số lượng bản ghi cần tạo
