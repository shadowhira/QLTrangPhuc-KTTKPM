# Tài liệu Hướng dẫn Module Thống kê

Tài liệu này mô tả chi tiết cách hoạt động của hai module thống kê trong hệ thống:
1. Thống kê khách hàng theo doanh thu
2. Thống kê doanh thu theo tháng/quý/năm

## Kiến trúc Tổng quan

Hệ thống sử dụng kiến trúc microservice với các thành phần chính:

- **Customer Service**: Quản lý thông tin khách hàng và đơn đặt trang phục (PostgreSQL)
- **Statistics Service**: Xử lý và lưu trữ thống kê (MongoDB)
- **API Gateway**: Điều hướng request từ frontend đến các service tương ứng

## 1. Module Thống kê Khách hàng theo Doanh thu

### Mô hình dữ liệu

```
ThongKeDoanhThuKhachHang {
    id: String                       // ID của bản ghi thống kê
    khachHangId: Long                // ID của khách hàng
    tenKhachHang: String             // Tên đầy đủ của khách hàng
    emailKhachHang: String           // Email của khách hàng
    tongDoanhThu: BigDecimal         // Tổng doanh thu từ khách hàng
    tongDonHang: Integer             // Tổng số đơn hàng của khách hàng
    doanhThuTheoKy: Map<String, BigDecimal>  // Doanh thu theo từng kỳ (tháng)
    capNhatLanCuoi: LocalDateTime    // Thời điểm cập nhật thống kê gần nhất
}
```

### Luồng hoạt động

1. **Khởi tạo thống kê**:
   - Frontend gọi API `POST /api/statistics/khach-hang-doanh-thu/tao-tat-ca` để tạo thống kê cho tất cả khách hàng
   - Hoặc `POST /api/statistics/khach-hang-doanh-thu/tao/{khachHangId}` để tạo thống kê cho một khách hàng cụ thể

2. **Quá trình tạo thống kê**:
   - `ThongKeDoanhThuKhachHangService` nhận yêu cầu và xử lý
   - Service sử dụng `KhachHangServiceClient` để lấy thông tin khách hàng từ Customer Service
   - Lấy danh sách đơn đặt trang phục của khách hàng
   - Tính toán tổng doanh thu và phân loại theo kỳ (tháng)
   - Lưu thông tin thống kê vào MongoDB

3. **Truy vấn thống kê**:
   - Frontend gọi API `GET /api/statistics/khach-hang-doanh-thu` để lấy danh sách thống kê
   - Dữ liệu được hiển thị dưới dạng bảng và biểu đồ

### Cập nhật thống kê

- Thống kê được cập nhật khi người dùng yêu cầu tạo mới
- Hệ thống không tự động cập nhật thống kê khi có đơn hàng mới
- Khi tạo thống kê mới, hệ thống sẽ cập nhật bản ghi hiện có nếu đã tồn tại

## 2. Module Thống kê Doanh thu theo Tháng/Quý/Năm

### Mô hình dữ liệu

```
ThongKeDoanhThu {
    id: String                // ID của bản ghi thống kê
    kyThongKe: String         // Loại kỳ thống kê: "THANG", "QUY", "NAM"
    giaTriKy: String          // Giá trị kỳ: "2023-01", "2023-Q1", "2023"
    ngayBatDau: LocalDateTime // Ngày bắt đầu kỳ thống kê
    ngayKetThuc: LocalDateTime // Ngày kết thúc kỳ thống kê
    tongDoanhThu: BigDecimal  // Tổng doanh thu trong kỳ
    tongDonHang: Integer      // Tổng số đơn hàng trong kỳ
    ngayTao: LocalDateTime    // Thời điểm tạo thống kê
}
```

### Mẫu thiết kế Strategy

Module này sử dụng mẫu thiết kế Strategy để xử lý các loại thống kê khác nhau:

1. **ThongKeStrategy**: Interface định nghĩa phương thức tạo thống kê
2. **ThongKeTheoThangStrategy**: Chiến lược thống kê theo tháng
3. **ThongKeTheoQuyStrategy**: Chiến lược thống kê theo quý
4. **ThongKeTheoNamStrategy**: Chiến lược thống kê theo năm
5. **ThongKeDoanhThuContext**: Lớp context quản lý và chọn chiến lược phù hợp

### Luồng hoạt động

1. **Khởi tạo thống kê**:
   - Frontend gọi API tương ứng để tạo thống kê:
     - `POST /api/statistics/doanh-thu/thang?nam={nam}&thang={thang}`
     - `POST /api/statistics/doanh-thu/quy?nam={nam}&quy={quy}`
     - `POST /api/statistics/doanh-thu/nam?nam={nam}`

2. **Quá trình tạo thống kê**:
   - `ThongKeDoanhThuService` nhận yêu cầu và gọi `ThongKeDoanhThuContext`
   - Context chọn chiến lược phù hợp dựa trên loại kỳ thống kê
   - Chiến lược được chọn sẽ:
     - Xác định khoảng thời gian của kỳ thống kê
     - Lấy danh sách đơn đặt trang phục trong khoảng thời gian đó
     - Tính toán tổng doanh thu và số lượng đơn hàng
     - Lưu thông tin thống kê vào MongoDB

3. **Truy vấn thống kê**:
   - Frontend gọi API `GET /api/statistics/doanh-thu` để lấy tất cả thống kê
   - Hoặc `GET /api/statistics/doanh-thu/ky/{kyThongKe}` để lấy thống kê theo loại kỳ
   - Dữ liệu được hiển thị dưới dạng bảng và biểu đồ

### Cách tính toán khoảng thời gian

1. **Thống kê theo tháng**:
   - Ngày bắt đầu: Ngày đầu tiên của tháng (năm-tháng-01 00:00:00)
   - Ngày kết thúc: Ngày cuối cùng của tháng (năm-tháng-[28/30/31] 23:59:59)

2. **Thống kê theo quý**:
   - Quý 1: 01/01 - 31/03
   - Quý 2: 01/04 - 30/06
   - Quý 3: 01/07 - 30/09
   - Quý 4: 01/10 - 31/12

3. **Thống kê theo năm**:
   - Ngày bắt đầu: 01/01/năm 00:00:00
   - Ngày kết thúc: 31/12/năm 23:59:59

## Tương tác giữa các Service

### Từ Statistics Service đến Customer Service

`KhachHangServiceClient` trong Statistics Service sử dụng WebClient để gọi các API của Customer Service:

1. `layTatCaKhachHang()`: Lấy danh sách tất cả khách hàng
2. `layKhachHangTheoId(Long id)`: Lấy thông tin một khách hàng cụ thể
3. `layDonDatTrangPhucTheoKhoangThoiGian(LocalDateTime ngayBatDau, LocalDateTime ngayKetThuc)`: Lấy đơn đặt trong khoảng thời gian
4. `layDonDatTrangPhucTheoKhachHangId(Long khachHangId)`: Lấy đơn đặt của một khách hàng

### Từ Frontend đến Backend

Frontend sử dụng các API được cung cấp qua API Gateway:

1. **Thống kê khách hàng**:
   - `GET /api/statistics/khach-hang-doanh-thu`: Lấy thống kê khách hàng
   - `POST /api/statistics/khach-hang-doanh-thu/tao-tat-ca`: Tạo thống kê cho tất cả khách hàng

2. **Thống kê doanh thu**:
   - `GET /api/statistics/doanh-thu`: Lấy tất cả thống kê doanh thu
   - `GET /api/statistics/doanh-thu/ky/{kyThongKe}`: Lấy thống kê theo loại kỳ
   - `POST /api/statistics/doanh-thu/thang`: Tạo thống kê theo tháng
   - `POST /api/statistics/doanh-thu/quy`: Tạo thống kê theo quý
   - `POST /api/statistics/doanh-thu/nam`: Tạo thống kê theo năm

## Lưu ý quan trọng

1. **Cập nhật thống kê**: Thống kê không tự động cập nhật khi có đơn hàng mới, cần tạo lại thống kê để cập nhật
2. **Tính toán doanh thu**: Chỉ tính doanh thu từ các đơn hàng có trạng thái "Đã thanh toán"
3. **Lưu trữ dữ liệu**: Thống kê được lưu trong MongoDB, tách biệt với dữ liệu gốc trong PostgreSQL
4. **Mở rộng**: Có thể dễ dàng thêm loại thống kê mới bằng cách tạo thêm chiến lược mới implement ThongKeStrategy

## Mở rộng trong tương lai

1. **Thống kê tự động**: Tự động cập nhật thống kê khi có đơn hàng mới
2. **Thống kê theo tuần**: Thêm chiến lược thống kê theo tuần
3. **Thống kê theo sản phẩm**: Thêm module thống kê doanh thu theo từng loại trang phục
4. **Dự báo doanh thu**: Thêm tính năng dự báo doanh thu dựa trên dữ liệu lịch sử
