# Hướng dẫn về việc thay đổi tên từ tiếng Anh sang tiếng Việt

Tài liệu này mô tả việc thay đổi tên các class, phương thức và thuộc tính từ tiếng Anh sang tiếng Việt trong module statistics-service.

## Cấu trúc hiện tại (Tiếng Việt)

### Model
- `ThongKeDoanhThu` - Thống kê doanh thu theo kỳ (tháng, quý, năm)
- `ThongKeDoanhThuKhachHang` - Thống kê doanh thu theo khách hàng

### Repository
- `ThongKeDoanhThuRepository` - Repository cho thống kê doanh thu
- `ThongKeDoanhThuKhachHangRepository` - Repository cho thống kê doanh thu khách hàng

### Service
- `ThongKeDoanhThuService` - Service xử lý thống kê doanh thu
- `ThongKeDoanhThuKhachHangService` - Service xử lý thống kê doanh thu khách hàng
- `KhachHangServiceClient` - Client gọi API từ customer-service

### Controller
- `ThongKeDoanhThuController` - Controller cho API thống kê doanh thu
- `ThongKeDoanhThuKhachHangController` - Controller cho API thống kê doanh thu khách hàng

### DTO
- `ThongKeDoanhThuDTO` - DTO cho thống kê doanh thu
- `ThongKeDoanhThuKhachHangDTO` - DTO cho thống kê doanh thu khách hàng

## Các thuộc tính trong model

### ThongKeDoanhThu
- `kyThongKe` - Kỳ thống kê ("THANG", "QUY", "NAM")
- `giaTriKy` - Giá trị kỳ ("2023-01", "2023-Q1", "2023")
- `ngayBatDau` - Ngày bắt đầu kỳ thống kê
- `ngayKetThuc` - Ngày kết thúc kỳ thống kê
- `tongDoanhThu` - Tổng doanh thu trong kỳ
- `tongDonHang` - Tổng số đơn hàng trong kỳ
- `ngayTao` - Ngày tạo thống kê

### ThongKeDoanhThuKhachHang
- `khachHangId` - ID của khách hàng
- `tenKhachHang` - Tên khách hàng
- `emailKhachHang` - Email khách hàng
- `tongDoanhThu` - Tổng doanh thu từ khách hàng
- `tongDonHang` - Tổng số đơn hàng của khách hàng
- `doanhThuTheoKy` - Doanh thu theo từng kỳ (tháng)
- `capNhatLanCuoi` - Thời gian cập nhật gần nhất

## Các phương thức API

### ThongKeDoanhThuController
- `GET /api/statistics/doanh-thu` - Lấy tất cả thống kê doanh thu
- `GET /api/statistics/doanh-thu/{id}` - Lấy thống kê doanh thu theo ID
- `GET /api/statistics/doanh-thu/ky/{kyThongKe}` - Lấy thống kê doanh thu theo kỳ
- `POST /api/statistics/doanh-thu/thang` - Tạo thống kê theo tháng
- `POST /api/statistics/doanh-thu/quy` - Tạo thống kê theo quý
- `POST /api/statistics/doanh-thu/nam` - Tạo thống kê theo năm

### ThongKeDoanhThuKhachHangController
- `GET /api/statistics/khach-hang-doanh-thu` - Lấy tất cả thống kê doanh thu khách hàng
- `GET /api/statistics/khach-hang-doanh-thu/{id}` - Lấy thống kê doanh thu khách hàng theo ID
- `GET /api/statistics/khach-hang-doanh-thu/khach-hang/{khachHangId}` - Lấy thống kê doanh thu theo ID khách hàng
- `POST /api/statistics/khach-hang-doanh-thu/tao-tat-ca` - Tạo thống kê cho tất cả khách hàng
- `POST /api/statistics/khach-hang-doanh-thu/tao/{khachHangId}` - Tạo thống kê cho khách hàng cụ thể

## Lưu ý quan trọng

1. Tất cả các class, phương thức và thuộc tính đều đã được đổi sang tiếng Việt, các phiên bản tiếng Anh đã bị xóa.

2. Các collection trong MongoDB đã được đổi tên:
   - `thong_ke_doanh_thu` - Collection lưu thống kê doanh thu
   - `thong_ke_doanh_thu_khach_hang` - Collection lưu thống kê doanh thu khách hàng

3. Khi gọi API từ frontend hoặc các service khác, cần sử dụng các endpoint tiếng Việt như đã liệt kê ở trên.
